using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedPra.Api.Data;
using MedPra.Api.DTOs;
using MedPra.Api.Models;
using MedPra.Api.Services;

namespace MedPra.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext db, TokenService tokenService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest req)
    {
        if (await db.Users.AnyAsync(u => u.Email == req.Email))
            return BadRequest(new { message = "Bu email zaten kayıtlı." });

        var user = new User
        {
            FullName = req.FullName,
            Email = req.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password)
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        var token = tokenService.GenerateToken(user);
        return Ok(new AuthResponse(token, user.FullName, user.Email, user.Id));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest req)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized(new { message = "Email veya şifre hatalı." });

        var token = tokenService.GenerateToken(user);
        return Ok(new AuthResponse(token, user.FullName, user.Email, user.Id));
    }
}
