using System.ComponentModel.DataAnnotations;


namespace StationaryServer2.DTO.User.Request
{
    public class LoginRequest
    {
        [Required]
        public string EmployeeID { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
