using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Conveyor.Data.Migrations
{
    public partial class LastUsednullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Token",
                table: "AuthenticationTokens",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastUsed",
                table: "AuthenticationTokens",
                nullable: true,
                oldClrType: typeof(DateTime));

            migrationBuilder.CreateIndex(
                name: "IX_AuthenticationTokens_Token",
                table: "AuthenticationTokens",
                column: "Token");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AuthenticationTokens_Token",
                table: "AuthenticationTokens");

            migrationBuilder.AlterColumn<string>(
                name: "Token",
                table: "AuthenticationTokens",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastUsed",
                table: "AuthenticationTokens",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldNullable: true);
        }
    }
}
