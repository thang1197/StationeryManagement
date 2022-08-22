using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    public class OrdersController : ControllerBase
    {
        private IStationeryRepository<Order> db_Order;
        private IStationeryRepository<Notification> db_Notification;
        private IStationeryRepository<Employee> db_Employee;
        private IStationeryRepository<OrderItem> db_OrderItem;
        private IStationeryRepository<Product> db_Product;
        public OrdersController(IStationeryRepository<Order> db_Order, IStationeryRepository<Notification> db_Notification, IStationeryRepository<Employee> db_Employee, IStationeryRepository<OrderItem> db_OrderItem, IStationeryRepository<Product> db_Product)
        {
            this.db_Order = db_Order;
            this.db_Notification = db_Notification;
            this.db_Employee = db_Employee;
            this.db_OrderItem = db_OrderItem;
            this.db_Product = db_Product;
        }


        ///Order
        [HttpGet("Orders")]
        public async Task<IEnumerable<Order>> GetCategories()
        {
            return await db_Order.ListAll();
        }
        [HttpGet("Order")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            return await db_Order.GetById(id);
        }
        [HttpPost("CreateOrder")]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] Order Order)
        {

            await db_Order.Insert(Order);
            return CreatedAtAction(nameof(GetCategories), new { id = Order.OrderId }, Order);
        }
        [HttpPut("UpdateOrder")]
        public async Task<ActionResult<Order>> UpdateOrder([FromBody] Order order)
        {
            try
            {
                int sumCard = 0;
                await db_Order.Update(order);
                Employee employee = await db_Employee.GetById(order.EmployeeId);
                Employee superior = await db_Employee.GetById(employee.Superiors);
                string message = "";
                if (order.Status == "Approved")
                {
                    message = "approved";
                    Notification notification = new Notification()
                    {
                        SenderId = employee.Superiors,
                        ReceiveId = order.EmployeeId,
                        CreatedAt = order.UpdatedAt,
                        Status = "Unseen",
                        Message = "Superior " + superior.EmployeeName + " has just " + message + " your order ID: " + order.OrderId + " at " + order.UpdatedAt
                    };
                    await db_Notification.Insert(notification);
                }
                string checkSuperior = superior.Superiors;
                if(checkSuperior != "" && order.Status == "Approved")
                {
                    Notification notificationS = new Notification()
                    {
                        SenderId = superior.EmployeeId,
                        ReceiveId = checkSuperior,
                        CreatedAt = order.UpdatedAt,
                        Status = "Unseen",
                        Message = "Manager " + superior.EmployeeName + " has just approved new order ID: " + order.OrderId + " at " + order.UpdatedAt
                    };
                    await db_Notification.Insert(notificationS);
                }
                if(order.Status == "Rejected" || order.Status == "Disagree")
                {
                    if(order.Status == "Rejected")
                    {
                        message = "Your budget has just been refunded " + sumCard + " because your order ID: " + order.OrderId + " had been rejected by your superior at " + order.UpdatedAt;
                    }else if(order.Status == "Disagree")
                    {
                        message = "Your budget has just been refunded " + sumCard + " because your order ID: " + order.OrderId +" had been disagreed by your director at " + order.UpdatedAt;
                    }
                    List<OrderItem> orderItems = await db_OrderItem.ListAll();
                    foreach (OrderItem item in orderItems)
                    {
                        if(item.OrderId == order.OrderId)
                        {
                            Product product = await db_Product.GetById(item.ProductId);
                            sumCard = sumCard + (item.Quantity * product.Price);
                        }
                    }
                    employee.Budget = employee.Budget + sumCard;
                    await db_Employee.Update(employee);
                    Notification notificationS = new Notification()
                    {
                        SenderId = superior.EmployeeId,
                        ReceiveId = order.EmployeeId,
                        CreatedAt = order.UpdatedAt,
                        Status = "Unseen",
                        Message = message
                    };
                    await db_Notification.Insert(notificationS);
                }
                if(order.Status == "Acceptance" && employee.RoleId != 2)
                {
                    Notification notificationS = new Notification()
                    {
                        SenderId = superior.EmployeeId,
                        ReceiveId = order.EmployeeId,
                        CreatedAt = order.UpdatedAt,
                        Status = "Unseen",
                        Message = "Your order ID: " + order.OrderId + " has been accepted by director at " + order.UpdatedAt
                    };
                    await db_Notification.Insert(notificationS);
                }
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }

        }
        [HttpDelete("OrderId")]
        public async Task<ActionResult> DeleteOrder(int id)
        {
            List<OrderItem> orderItems = await db_OrderItem.ListAll();
            foreach (OrderItem item in orderItems)
            {
                if(item.OrderId == id)
                {
                    await db_OrderItem.Delete(item);
                }
            }
            var data = await db_Order.GetById(id);
            if (data == null)
            {
                return NotFound();
            }
            await db_Order.Delete(data);
            return NoContent();
        }
    }
}
