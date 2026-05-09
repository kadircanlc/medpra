using Microsoft.EntityFrameworkCore;
using MedPra.Api.Models;

namespace MedPra.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<CaseSession> CaseSessions => Set<CaseSession>();
    public DbSet<Disease> Diseases => Set<Disease>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<CaseSession>()
            .HasOne(c => c.User)
            .WithMany(u => u.CaseSessions)
            .HasForeignKey(c => c.UserId);
    }
}
