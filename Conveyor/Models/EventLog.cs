using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Conveyor.Models
{
    public class EventLog
    {
        [Key]
        public int Id { get; set; }
        public EventTypes EventType { get; set; }
        public string Message { get; set; }
        public string Source { get; set; }
        public string StackTrace { get; set; }
        public string UserId { get; set; }
        public DateTime TimeStamp { get; set; } = DateTime.Now;
    }
    public enum EventTypes
    {
        Info = 0,
        Error = 1,
        Debug = 2
    }
}
