using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StationaryServer2.Migrations
{
    public partial class stationery : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    CategotyId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategotyName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Id_parent = table.Column<int>(type: "int", nullable: true, defaultValueSql: "((0))"),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: true),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true),
                    Deleted_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Category__2A863D5D3CEFB49A", x => x.CategotyId);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleName = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    Budget = table.Column<int>(type: "int", nullable: true, defaultValueSql: "((0))"),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: true),
                    updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.RoleId);
                });

            migrationBuilder.CreateTable(
                name: "Employee",
                columns: table => new
                {
                    EmployeeId = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    EmployeeName = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    Email = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    Address = table.Column<string>(type: "text", nullable: false),
                    Phone = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    Gender = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    Birthday = table.Column<DateTime>(type: "date", nullable: false),
                    Password = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    Department = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    Superiors = table.Column<int>(type: "int", nullable: true, defaultValueSql: "((0))"),
                    Role_id = table.Column<int>(type: "int", nullable: false),
                    IsAdmin = table.Column<bool>(type: "bit", nullable: true, defaultValueSql: "((0))"),
                    Budget = table.Column<int>(type: "int", nullable: true, defaultValueSql: "((0))"),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: true),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employee", x => x.EmployeeId);
                    table.ForeignKey(
                        name: "fk_Employee_Roles_Role_id",
                        column: x => x.Role_id,
                        principalTable: "Role",
                        principalColumn: "RoleId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Product",
                columns: table => new
                {
                    ProductId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductName = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: true, defaultValueSql: "((0))"),
                    Price = table.Column<int>(type: "int", nullable: false),
                    feature_img_path = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    Category_id = table.Column<int>(type: "int", nullable: true),
                    Product_Enable = table.Column<bool>(type: "bit", nullable: true, defaultValueSql: "((0))"),
                    Role_id = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: true),
                    updated_at = table.Column<DateTime>(type: "datetime", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product", x => x.ProductId);
                    table.ForeignKey(
                        name: "fk_Employee_Product_Roles_Role_id",
                        column: x => x.Role_id,
                        principalTable: "Role",
                        principalColumn: "RoleId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_product_categories_categoryid",
                        column: x => x.Category_id,
                        principalTable: "Category",
                        principalColumn: "CategotyId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Order",
                columns: table => new
                {
                    OrderId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    Status = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: true),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Order", x => x.OrderId);
                    table.ForeignKey(
                        name: "fk_Orders_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RefreshToken",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    Token = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    JwtId = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    IsUsed = table.Column<bool>(type: "bit", nullable: false),
                    IsRevorked = table.Column<bool>(type: "bit", nullable: false),
                    AddedDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    ExpiryDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshToken", x => x.Id);
                    table.ForeignKey(
                        name: "fk_Employee_RefreshToken_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Order_item",
                columns: table => new
                {
                    Order_item_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Order_id = table.Column<int>(type: "int", nullable: false),
                    Product_id = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Created_at = table.Column<DateTime>(type: "datetime", nullable: true),
                    Updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Order_item", x => x.Order_item_id);
                    table.ForeignKey(
                        name: "fk_Orders_Order_items_Order_id",
                        column: x => x.Order_id,
                        principalTable: "Order",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_Products_Order_items_Product_id",
                        column: x => x.Product_id,
                        principalTable: "Product",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Employee_Role_id",
                table: "Employee",
                column: "Role_id");

            migrationBuilder.CreateIndex(
                name: "IX_Order_EmployeeId",
                table: "Order",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Order_item_Order_id",
                table: "Order_item",
                column: "Order_id");

            migrationBuilder.CreateIndex(
                name: "IX_Order_item_Product_id",
                table: "Order_item",
                column: "Product_id");

            migrationBuilder.CreateIndex(
                name: "IX_Product_Category_id",
                table: "Product",
                column: "Category_id");

            migrationBuilder.CreateIndex(
                name: "IX_Product_Role_id",
                table: "Product",
                column: "Role_id");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshToken_EmployeeId",
                table: "RefreshToken",
                column: "EmployeeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Order_item");

            migrationBuilder.DropTable(
                name: "RefreshToken");

            migrationBuilder.DropTable(
                name: "Order");

            migrationBuilder.DropTable(
                name: "Product");

            migrationBuilder.DropTable(
                name: "Employee");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "Role");
        }
    }
}
