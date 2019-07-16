using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Conveyor.Models;
using Microsoft.EntityFrameworkCore;

namespace Conveyor.Data
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

        public async Task DeleteFile(string fileGuid, string userId)
        {
            DbContext.FileDescriptions.RemoveRange(DbContext.FileDescriptions.Where(x => x.User.Id == userId && x.Guid == fileGuid));
            await DbContext.SaveChangesAsync();
        }

        public async Task DeleteFiles(string[] fileGuids, string userId)
        {
            DbContext.FileDescriptions.RemoveRange(DbContext.FileDescriptions.Where(x => x.User.Id == userId && fileGuids.Contains(x.Guid)));
            await DbContext.SaveChangesAsync();
        }

        public List<FileDescription> GetAllDescriptions(string userID)
        {
            return DbContext.FileDescriptions.Where(x => x.User.Id == userID)?.ToList();
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
                    ?.Where(x => string.IsNullOrWhiteSpace(x.User.Id))
                    ?.FirstOrDefault(x => x.Guid == fileGuid);
        }

        public async Task TransferFilesToAccount(string[] fileGuids, string userId)
        {
            var validFiles = DbContext.FileDescriptions.Where(x => x.User.Id == null && fileGuids.Contains(x.Guid));
            foreach (var file in validFiles)
            {
                file.UserId = userId;
            }
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
