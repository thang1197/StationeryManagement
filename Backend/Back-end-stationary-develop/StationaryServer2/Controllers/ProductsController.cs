using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StationaryServer2.DTO.Product;
using StationaryServer2.Models.Stationary;
using StationaryServer2.Repository;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace StationaryServer2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private IStationeryRepository<Product> db_Product;
        public ProductsController(IStationeryRepository<Product> db_Product, IWebHostEnvironment env)
        {
            this.db_Product = db_Product;
            this._env = env;
        }


        ///Product
        [HttpGet("Products")]
        public async Task<IEnumerable<Product>> GetCategories()
        {
            return await db_Product.ListAll();
        }
        [HttpGet("Product")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            return await db_Product.GetById(id);
        }

        [HttpPost("CreateProduct")]
        public async Task<ActionResult<HttpResponseMessage>> HandleAsync(List<IFormFile> files, [FromForm] string productJson)
        {

            try
            {

                // Config JSON 
                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    NumberHandling = JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.WriteAsString
                };
                // Convert JSON string sang Object
                var productRequest = JsonSerializer.Deserialize<ProductRequest>(productJson, options);

                // Khoi tao mot product moi
                Product product = null;


                if (files.Count > 0)
                {
                    var formFile = files[0];
                    if (formFile.Length > 0)
                    {
                        // Luu Product xuong BD
                        product = new Product()
                        {
                            ProductName = productRequest.ProductName,
                            Quantity = productRequest.Quantity,
                            Price = productRequest.Price,
                            CategoryId = productRequest.CategoryId,
                            ProductEnable = productRequest.ProductEnable,
                            CreatedAt = productRequest.CreatedAt,
                            RoleId = productRequest.RoleId,
                            UpdatedAt = productRequest.UpdatedAt,
                            DeletedAt = productRequest.DeletedAt,

                        };
                        await db_Product.Insert(product);
                        // Sau khi luu Product se co duoc Product Id
                        var filePath = Path.Combine(_env.ContentRootPath, "Images/products/", product.ProductId.ToString());
                        if (!Directory.Exists(filePath))
                        {
                            Directory.CreateDirectory(filePath);
                        }
                        filePath = Path.Combine(filePath, formFile.FileName);

                        using var stream = new FileStream(filePath, FileMode.Create);
                        await formFile.CopyToAsync(stream);

                        // Cap nhat lai url cua san pham sau luu xong hinh anh
                        product.FeatureImgPath = "Images/products/" + product.ProductId.ToString() + "/" + formFile.FileName;
                        await db_Product.Update(product);


                    }
                }
                else
                {
                    return BadRequest();
                }

                var response = new
                {
                    product.ProductId,
                    product.ProductName,
                    product.Quantity,
                    product.Price,
                    product.CategoryId,
                    product.ProductEnable,
                    product.CreatedAt,
                    product.UpdatedAt,
                    product.DeletedAt,
                };
                return Ok(response);
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        [HttpPut("UpdateProduct")]
        public async Task<ActionResult<Product>> UpdateProduct(List<IFormFile> files, [FromForm] string productJson)
        {
            // Config JSON 
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                NumberHandling = JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.WriteAsString
            };
            // Convert JSON string sang Object
            var productRequest = JsonSerializer.Deserialize<Product>(productJson, options);
            try
            {
                if (files.Count > 0)
                {
                    var formFile = files[0];

                    if (formFile.Length > 0)
                    {
                        var filePath = Path.Combine(_env.ContentRootPath, "Images/products/", productRequest.ProductId.ToString());
                        if (!Directory.Exists(filePath))
                        {
                            Directory.CreateDirectory(filePath);
                        }
                        filePath = Path.Combine(filePath, formFile.FileName);

                        using var stream = new FileStream(filePath, FileMode.Create);
                        await formFile.CopyToAsync(stream);

                        // Cap nhat lai url cua san pham sau luu xong hinh anh
                        productRequest.FeatureImgPath = "Images/products/" + productRequest.ProductId.ToString() + "/" + formFile.FileName;
                        var updatePro = await db_Product.Update(productRequest);
                        return Ok(updatePro);
                    }
                }

                var update= await db_Product.Update(productRequest);
                return Ok(update);
            }
            catch (Exception)
            {

                return BadRequest();
            }

        }
        [HttpDelete("ProductId")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var data = await db_Product.GetById(id);
            if (data == null)
            {
                return NotFound();
            }
            await db_Product.Delete(data);
            return NoContent();
        }


    }
}
