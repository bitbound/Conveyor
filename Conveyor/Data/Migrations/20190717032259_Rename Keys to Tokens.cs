using Microsoft.EntityFrameworkCore.Migrations;

namespace Conveyor.Data.Migrations
{
    public partial class RenameKeystoTokens : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Key",
                table: "AuthenticationTokens",
                newName: "Token");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "AuthenticationTokens",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "AuthenticationTokens");

            migrationBuilder.RenameColumn(
                name: "Token",
                table: "AuthenticationTokens",
                newName: "Key");
        }
    }
}
