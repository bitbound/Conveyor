using Microsoft.EntityFrameworkCore.Migrations;

namespace Conveyer.Data.Migrations
{
    public partial class RemoveFileDescriptionContentTypeDisposition : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ContentDisposition",
                table: "FileDescriptions",
                newName: "Guid");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Guid",
                table: "FileDescriptions",
                newName: "ContentDisposition");
        }
    }
}
