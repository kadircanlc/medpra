using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedPra.Api.Data;
using MedPra.Api.DTOs;

namespace MedPra.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ScoreController(AppDbContext db) : ControllerBase
{
    [HttpGet("leaderboard")]
    public async Task<IActionResult> GetLeaderboard()
    {
        var leaderboard = await db.CaseSessions
            .Where(s => s.Status == "completed")
            .GroupBy(s => new { s.UserId, s.User.FullName })
            .Select(g => new LeaderboardEntry(
                g.Key.FullName,
                g.Count(),
                g.Count(s => s.IsCorrect == true),
                g.Count() > 0 ? Math.Round((double)g.Count(s => s.IsCorrect == true) / g.Count() * 100, 1) : 0,
                g.Sum(s => s.DiagnosisScore ?? 0)
            ))
            .OrderByDescending(e => e.TotalScore)
            .Take(50)
            .ToListAsync();

        return Ok(leaderboard);
    }
}
