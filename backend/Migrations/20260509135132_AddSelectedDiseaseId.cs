using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedPra.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddSelectedDiseaseId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SelectedDiseaseId",
                table: "CaseSessions",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SelectedDiseaseId",
                table: "CaseSessions");
        }
    }
}
