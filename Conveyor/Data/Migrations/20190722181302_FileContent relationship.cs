using Microsoft.EntityFrameworkCore.Migrations;

namespace Conveyor.Data.Migrations
{
    public partial class FileContentrelationship : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"delete FileDescriptions; 
                                    delete FileContents;");

            migrationBuilder.DropForeignKey(
                name: "FK_FileDescriptions_FileContents_ContentId",
                table: "FileDescriptions");

            migrationBuilder.DropIndex(
                name: "IX_FileDescriptions_ContentId",
                table: "FileDescriptions");

            migrationBuilder.DropColumn(
                name: "ContentId",
                table: "FileDescriptions");

            migrationBuilder.AddColumn<int>(
                name: "FileDescriptionId",
                table: "FileContents",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "AspNetUserTokens",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "LoginProvider",
                table: "AspNetUserTokens",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "ProviderKey",
                table: "AspNetUserLogins",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "LoginProvider",
                table: "AspNetUserLogins",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 128);

            migrationBuilder.CreateIndex(
                name: "IX_FileContents_FileDescriptionId",
                table: "FileContents",
                column: "FileDescriptionId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_FileContents_FileDescriptions_FileDescriptionId",
                table: "FileContents",
                column: "FileDescriptionId",
                principalTable: "FileDescriptions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileContents_FileDescriptions_FileDescriptionId",
                table: "FileContents");

            migrationBuilder.DropIndex(
                name: "IX_FileContents_FileDescriptionId",
                table: "FileContents");

            migrationBuilder.DropColumn(
                name: "FileDescriptionId",
                table: "FileContents");

            migrationBuilder.AddColumn<int>(
                name: "ContentId",
                table: "FileDescriptions",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "AspNetUserTokens",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "LoginProvider",
                table: "AspNetUserTokens",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "ProviderKey",
                table: "AspNetUserLogins",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "LoginProvider",
                table: "AspNetUserLogins",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.CreateIndex(
                name: "IX_FileDescriptions_ContentId",
                table: "FileDescriptions",
                column: "ContentId");

            migrationBuilder.AddForeignKey(
                name: "FK_FileDescriptions_FileContents_ContentId",
                table: "FileDescriptions",
                column: "ContentId",
                principalTable: "FileContents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
