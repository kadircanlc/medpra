using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedPra.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddChatAndTestResults : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ChatHistoryJson",
                table: "CaseSessions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TestResultsJson",
                table: "CaseSessions",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChatHistoryJson",
                table: "CaseSessions");

            migrationBuilder.DropColumn(
                name: "TestResultsJson",
                table: "CaseSessions");
        }
    }
}
