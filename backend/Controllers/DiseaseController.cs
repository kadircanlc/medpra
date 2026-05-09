using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedPra.Api.Data;
using MedPra.Api.DTOs;
using MedPra.Api.Models;

namespace MedPra.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DiseaseController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string? specialty)
    {
        var query = db.Diseases.AsQueryable();
        if (!string.IsNullOrEmpty(specialty))
            query = query.Where(d => d.Specialty == specialty);

        var diseases = await query
            .OrderBy(d => d.Specialty).ThenBy(d => d.Name)
            .Select(d => new DiseaseDto(d.Id, d.Specialty, d.Name, d.IsActive))
            .ToListAsync();

        return Ok(diseases);
    }

    [HttpGet("specialties")]
    public async Task<IActionResult> GetSpecialties()
    {
        var specialties = await db.Diseases
            .Where(d => d.IsActive)
            .Select(d => d.Specialty)
            .Distinct()
            .OrderBy(s => s)
            .ToListAsync();

        return Ok(specialties);
    }

    [HttpGet("counts")]
    public async Task<IActionResult> GetCounts()
    {
        var counts = await db.Diseases
            .Where(d => d.IsActive)
            .GroupBy(d => d.Specialty)
            .Select(g => new { specialty = g.Key, count = g.Count() })
            .ToListAsync();

        return Ok(counts.ToDictionary(x => x.specialty, x => x.count));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Add(AddDiseaseRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Specialty) || string.IsNullOrWhiteSpace(req.Name))
            return BadRequest(new { message = "Uzmanlık ve hastalık adı zorunludur." });

        var exists = await db.Diseases.AnyAsync(d =>
            d.Specialty == req.Specialty && d.Name == req.Name);
        if (exists)
            return Conflict(new { message = "Bu hastalık zaten mevcut." });

        var disease = new Disease { Specialty = req.Specialty, Name = req.Name };
        db.Diseases.Add(disease);
        await db.SaveChangesAsync();

        return Created($"/api/disease/{disease.Id}", new DiseaseDto(disease.Id, disease.Specialty, disease.Name, disease.IsActive));
    }

    [HttpPatch("{id}/toggle")]
    [Authorize]
    public async Task<IActionResult> Toggle(int id)
    {
        var disease = await db.Diseases.FindAsync(id);
        if (disease == null) return NotFound();

        disease.IsActive = !disease.IsActive;
        await db.SaveChangesAsync();

        return Ok(new DiseaseDto(disease.Id, disease.Specialty, disease.Name, disease.IsActive));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var disease = await db.Diseases.FindAsync(id);
        if (disease == null) return NotFound();

        db.Diseases.Remove(disease);
        await db.SaveChangesAsync();

        return NoContent();
    }
}
