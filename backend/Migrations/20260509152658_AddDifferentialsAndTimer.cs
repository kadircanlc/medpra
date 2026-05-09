using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedPra.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDifferentialsAndTimer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StudentDifferentials",
                table: "CaseSessions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TimeTakenSeconds",
                table: "CaseSessions",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StudentDifferentials",
                table: "CaseSessions");

            migrationBuilder.DropColumn(
                name: "TimeTakenSeconds",
                table: "CaseSessions");
        }
    }
}
