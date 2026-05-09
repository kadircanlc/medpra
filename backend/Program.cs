using System.Text;
using Anthropic.SDK;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MedPra.Api.Data;
using MedPra.Api.Models;
using MedPra.Api.Services;
using MedPra.Api.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!))
        };
    });

builder.Services.AddAuthorization();

var allowedOrigins = new List<string> { "http://localhost:3000" };
var frontendUrl = builder.Configuration["Frontend:Url"];
if (!string.IsNullOrEmpty(frontendUrl))
    allowedOrigins.AddRange(frontendUrl.Split(',', StringSplitOptions.RemoveEmptyEntries));

builder.Services.AddCors(options =>
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins(allowedOrigins.ToArray())
              .AllowAnyHeader()
              .AllowAnyMethod()));

builder.Services.AddSingleton(new AnthropicClient(builder.Configuration["Anthropic:ApiKey"]!));
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IEvaluationService, EvaluationService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    foreach (var (specialty, names) in DiseasePool.All)
    {
        if (!db.Diseases.Any(d => d.Specialty == specialty))
        {
            foreach (var name in names)
                db.Diseases.Add(new Disease { Specialty = specialty, Name = name });
        }
    }
    db.SaveChanges();
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
