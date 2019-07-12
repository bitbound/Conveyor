using Microsoft.EntityFrameworkCore.Migrations;

namespace Conveyer.Data.Migrations
{
    public partial class ContentDisposition : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Guid",
                table: "FileDescriptions",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContentDisposition",
                table: "FileDescriptions",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_FileDescriptions_Guid",
                table: "FileDescriptions",
                column: "Guid");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_FileDescriptions_Guid",
                table: "FileDescriptions");

            migrationBuilder.DropColumn(
                name: "ContentDisposition",
                table: "FileDescriptions");

            migrationBuilder.AlterColumn<string>(
                name: "Guid",
                table: "FileDescriptions",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
