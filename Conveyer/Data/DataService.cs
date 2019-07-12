using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Conveyer.Models;
using Microsoft.EntityFrameworkCore;

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

        public FileDescription GetFileDescriptionAndContent(string fileGuid, string userId)
        {
            return DbContext.FileDescriptions
                    ?.Include(x => x.Content)
                    ?.Where(x => x.User.Id == userId)
                    ?.FirstOrDefault(x => x.Guid == fileGuid);
        }

        public FileDescription GetFileDescriptionAndContent(string fileGuid)
        {
            return DbContext.FileDescriptions
                    ?.Include(x => x.Content)
                    ?.Where(x => x.User == null)
                    ?.FirstOrDefault(x => x.Guid == fileGuid);
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

        public List<FileDescription> GetAllDescriptions(string userID)
        {
            return DbContext.FileDescriptions.Where(x => x.User.Id == userID).ToList();
        }
    }
}
