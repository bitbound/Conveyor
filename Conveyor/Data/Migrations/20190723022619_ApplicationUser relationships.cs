using Microsoft.EntityFrameworkCore.Migrations;

namespace Conveyor.Data.Migrations
{
    public partial class ApplicationUserrelationships : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AuthenticationTokens_AspNetUsers_UserId",
                table: "AuthenticationTokens");

            migrationBuilder.DropForeignKey(
                name: "FK_FileDescriptions_AspNetUsers_UserId",
                table: "FileDescriptions");

            migrationBuilder.AddForeignKey(
                name: "FK_AuthenticationTokens_AspNetUsers_UserId",
                table: "AuthenticationTokens",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FileDescriptions_AspNetUsers_UserId",
                table: "FileDescriptions",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AuthenticationTokens_AspNetUsers_UserId",
                table: "AuthenticationTokens");

            migrationBuilder.DropForeignKey(
                name: "FK_FileDescriptions_AspNetUsers_UserId",
                table: "FileDescriptions");

            migrationBuilder.AddForeignKey(
                name: "FK_AuthenticationTokens_AspNetUsers_UserId",
                table: "AuthenticationTokens",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_FileDescriptions_AspNetUsers_UserId",
                table: "FileDescriptions",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
