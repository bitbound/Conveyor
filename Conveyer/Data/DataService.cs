using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Conveyer.Models;

namespace Conveyer.Data
{
    public class DataService
    {
        public DataService(ApplicationDbContext dbContext)
        {
            DbContext = dbContext;
        }

        public ApplicationDbContext DbContext { get; }

        public async Task AddFileDescription(FileDescription fileDescription)
        {
            DbContext.FileDescriptions.Add(fileDescription);
            await DbContext.SaveChangesAsync();
        }

        public async Task WriteEvent(EventLog eventLog)
        {
            DbContext.EventLogs.Add(eventLog);
            await DbContext.SaveChangesAsync();
        }

        public async Task WriteEvent(Exception ex)
        {
            DbContext.EventLogs.Add(new EventLog()
            {
                EventType = EventTypes.Error,
                Message = ex.Message,
                Source = ex.Source,
                StackTrace = ex.StackTrace,
                TimeStamp = DateTime.Now
            });
            await DbContext.SaveChangesAsync();
        }

        public async Task WriteEvent(string message)
        {
            DbContext.EventLogs.Add(new EventLog()
            {
                EventType = EventTypes.Info,
                Message = message,
                TimeStamp = DateTime.Now
            });
            await DbContext.SaveChangesAsync();
        }
    }
}
