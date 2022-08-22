using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StationaryServer2.DTO.User.Request;
using StationaryServer2.Models.Stationary;
using StationaryServer2.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StationaryServer2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class OrderItemsController : ControllerBase
    {
        private IStationeryRepository<OrderItem> db_OrderItem;
        private IStationeryRepository<Order> db_Order;
        private IStationeryRepository<Product> db_Product;
        private IStationeryRepository<Notification> db_Notification;
        private IStationeryRepository<Employee> db_Employee;
        public OrderItemsController(IStationeryRepository<OrderItem> db_OrderItem,IStationeryRepository<Order> db_Order, IStationeryRepository<Notification> db_Notification, IStationeryRepository<Employee> db_Employee, IStationeryRepository<Product> db_Product)
        {
            this.db_OrderItem = db_OrderItem;
            this.db_Order = db_Order;
            this.db_Notification = db_Notification;
            this.db_Employee = db_Employee;
            this.db_Product = db_Product;
        }


        ///OrderItem
        [HttpGet("OrderItems")]
        public async Task<IEnumerable<OrderItem>> GetCategories()
        {
            return await db_OrderItem.ListAll();
        }
        [HttpGet("OrderItem")]
        public async Task<ActionResult<OrderItem>> GetOrderItem(int id)
        {
            return await db_OrderItem.GetById(id);
        }
        
        [HttpPut("UpdateOrderItem")]
        public async Task<ActionResult<OrderItem>> UpdateOrderItem([FromBody] OrderItem OrderItem)
        {
            try
            {
                var updatePro = await db_OrderItem.Update(OrderItem);
                return Ok(updatePro);
            }
            catch (Exception)
            {
                return BadRequest();
            }

        }
        [HttpDelete("OrderItemId")]
        public async Task<ActionResult> DeleteOrderItem(int id)
        {
            var data = await db_OrderItem.GetById(id);
            if (data == null)
            {
                return NotFound();
            }
            await db_OrderItem.Delete(data);
            return NoContent();
        }

        [HttpPost("CreateOrderItem")]

        public async Task<ActionResult> CreateOrderItem([FromBody] OrderRequest orderRequest)
        {
            try
            {
                int sumCard = 0;
                Order order = new Order()
                {
                    EmployeeId = orderRequest.EmployeeId,
                    Status = orderRequest.Status,
                    CreatedAt = orderRequest.CreatedAt
                };

                await db_Order.Insert(order);
                List<Order> orders = await db_Order.ListAll();
                int newOrderIndex = orders.Count - 1;
                Order newOrder = orders[newOrderIndex];         
                foreach (OrderItemRequest item in orderRequest.Products)
                {
                    var dataPro = await db_Product.GetById(item.ProductId);
                    sumCard = sumCard + (item.Quantity * dataPro.Price);
                    OrderItem orderItem = new OrderItem()
                    {
                        OrderId = newOrder.OrderId,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity
                    };
                    await db_OrderItem.Insert(orderItem);
                }
                //Tao Notification
                Employee employee = await db_Employee.GetById(orderRequest.EmployeeId);
                Notification notification = new Notification()
                {
                    SenderId = orderRequest.EmployeeId,
                    ReceiveId = employee.Superiors,
                    CreatedAt = orderRequest.CreatedAt,
                    Status = "Unseen",
                    Message = "Employee " + employee.EmployeeName + " has just ordered order ID: " + newOrder.OrderId + " at " + orderRequest.CreatedAt
                };
                await db_Notification.Insert(notification);
                //
                employee.Budget = employee.Budget - sumCard;
                await db_Employee.Update(employee);
                return Ok();
            }
            catch (Exception)
            {

                return BadRequest();
            }
        }
    }
}
