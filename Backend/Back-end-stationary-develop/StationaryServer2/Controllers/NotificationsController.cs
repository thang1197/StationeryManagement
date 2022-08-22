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
    public class NotificationsController : ControllerBase
    {
        private IStationeryRepository<Notification> db_Notification;
        public NotificationsController(IStationeryRepository<Notification> db_Notification)
        {
            this.db_Notification = db_Notification;
        }


        ///Notification
        [HttpGet("Notifications")]
        public async Task<IEnumerable<Notification>> GetNotifications()
        {
            return await db_Notification.ListAll();
        }
        [HttpGet("Notification")]
        public async Task<ActionResult<Notification>> GetNotification(int id)
        {
            return await db_Notification.GetById(id);
        }
        [HttpPost("CreateNotification")]
        public async Task<ActionResult<Notification>> CreateNotification([FromBody] Notification notification)
        {

            await db_Notification.Insert(notification);
            return CreatedAtAction(nameof(GetNotifications), new { id = notification.Id }, notification);
        }
        
        [HttpDelete("NotificationId")]
        public async Task<ActionResult<Category>> DeleteCategory(int id)
        {
            var data = await db_Notification.GetById(id);
            if (data == null)
            {
                return NotFound();
            }
            await db_Notification.Delete(data);
            return NoContent();
        }
    }
}
