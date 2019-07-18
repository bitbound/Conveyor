using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Conveyor.Models;
using Conveyor.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Protocols;

namespace Conveyor.Data
{
    public class DataService
    {
        public DataService(ApplicationDbContext dbContext, ApplicationConfig config)
        {
            DbContext = dbContext;
            AppConfig = config;
        }

        private ApplicationConfig AppConfig { get; }
        private ApplicationDbContext DbContext { get; }
        public async Task AddFileDescription(FileDescription fileDescription)
        {
            DbContext.FileDescriptions.Add(fileDescription);
            await DbContext.SaveChangesAsync();
        }

        public async Task<AuthenticationToken> AddNewToken(ApplicationUser user)
        {
            var newToken = new AuthenticationToken()
            {
                DateCreated = DateTime.Now,
                Description = "New Token",
                Token = Guid.NewGuid().ToString(),
                UserId = user.Id
            };
            DbContext.AuthenticationTokens.Add(newToken);
            await DbContext.SaveChangesAsync();
            return newToken;
        }

        public async Task DeleteAuthToken(string authToken, ApplicationUser user)
        {
            DbContext.AuthenticationTokens.RemoveRange(DbContext.AuthenticationTokens.Where(x => x.User.Id == user.Id && x.Token == authToken));
            await DbContext.SaveChangesAsync();
        }

        public async Task DeleteAuthTokens(string[] authTokens, ApplicationUser user)
        {
            DbContext.AuthenticationTokens.RemoveRange(DbContext.AuthenticationTokens.Where(x => x.User.Id == user.Id && authTokens.Contains(x.Token)));
            await DbContext.SaveChangesAsync();
        }

        public async Task DeleteFile(string fileGuid, ApplicationUser user)
        {
            DbContext.FileDescriptions.RemoveRange(DbContext.FileDescriptions.Where(x => x.User.Id == user.Id && x.Guid == fileGuid));
            await DbContext.SaveChangesAsync();
        }

        public async Task DeleteFiles(string[] fileGuids, ApplicationUser user)
        {
            DbContext.FileDescriptions.RemoveRange(DbContext.FileDescriptions.Where(x => x.User.Id == user.Id && fileGuids.Contains(x.Guid)));
            await DbContext.SaveChangesAsync();
        }
        public List<AuthenticationToken> GetAllAuthTokens(ApplicationUser user)
        {
            return DbContext.AuthenticationTokens.Where(x => x.User.Id == user.Id)?.ToList();
        }

        public async Task<List<FileDescription>> GetAllDescriptions(ApplicationUser user)
        {
            var expiredDescriptions = DbContext.FileDescriptions.Where(x => x.DateUploaded.AddDays(AppConfig.DataRetentionInDays) < DateTime.Now);
            if (expiredDescriptions.Any())
            {
                DbContext.FileDescriptions.RemoveRange(expiredDescriptions);
                await DbContext.SaveChangesAsync();
            }
            return DbContext.FileDescriptions.Where(x => x.User.Id == user.Id)?.ToList();
        }

        public FileDescription GetFileDescriptionAndContent(string fileGuid, ApplicationUser user)
        {
            return DbContext.FileDescriptions
                    ?.Include(x => x.Content)
                    ?.Where(x => x.User.Id == user.Id)
                    ?.FirstOrDefault(x => x.Guid == fileGuid);
        }

        public FileDescription GetFileDescriptionAndContent(string fileGuid)
        {
            return DbContext.FileDescriptions
                    ?.Include(x => x.Content)
                    ?.Where(x => string.IsNullOrWhiteSpace(x.User.Id))
                    ?.FirstOrDefault(x => x.Guid == fileGuid);
        }

        public async Task TransferFilesToAccount(string[] fileGuids, ApplicationUser user)
        {
            var validFiles = DbContext.FileDescriptions.Where(x => x.User.Id == null && fileGuids.Contains(x.Guid));
            foreach (var file in validFiles)
            {
                file.UserId = user.Id;
            }
            await DbContext.SaveChangesAsync();
        }

        public async Task UpdateTokenDescription(string tokenGuid, string description, ApplicationUser user)
        {
            var targetToken = DbContext.AuthenticationTokens.FirstOrDefault(x => x.UserId == user.Id && x.Token == tokenGuid);
            if (targetToken != null)
            {
                targetToken.Description = description;
                await DbContext.SaveChangesAsync();
            }
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
