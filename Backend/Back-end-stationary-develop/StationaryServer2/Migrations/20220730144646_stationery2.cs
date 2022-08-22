using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StationaryServer2.Migrations
{
    public partial class stationery2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Notification",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SenderId = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    ReceiveId = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    Message = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    Status = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notification", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Notification");
        }
    }
}
