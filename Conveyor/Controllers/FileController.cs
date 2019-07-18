using Conveyor.Data;
using Conveyor.DTOs;
using Conveyor.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Conveyor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        public FileController(FileExtensionContentTypeProvider fileExtProv,
            UserManager<ApplicationUser> userManager,
            DataService dataService)
        {
            FileExtProv = fileExtProv;
            UserManager = userManager;
            DataService = dataService;
        }

        private DataService DataService { get; }
        private FileExtensionContentTypeProvider FileExtProv { get; }
        private UserManager<ApplicationUser> UserManager { get; }

        [HttpDelete("[action]/{fileGuid}")]
        public async Task<ActionResult> Delete(string fileGuid)
        {
            var user = await UserManager.GetUserAsync(User);
            await DataService.DeleteFile(fileGuid, user);
            return Ok();
        }

        [HttpDelete("[action]/{fileGuid}/{authToken}")]
        public async Task<ActionResult> Delete(string fileGuid, string authToken)
        {
            var ipAddress = HttpContext?.Connection?.RemoteIpAddress?.ToString();
            await DataService.DeleteFile(fileGuid, authToken, ipAddress);
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<ActionResult> DeleteMany([FromBody]string[] fileGuids)
        {
            var user = await UserManager.GetUserAsync(User);
            await DataService.DeleteFiles(fileGuids, user);
            return Ok();
        }

        [HttpPost("[action]/{authToken}")]
        public async Task<ActionResult> DeleteMany([FromBody]string[] fileGuids, string authToken)
        {
            var ipAddress = HttpContext?.Connection?.RemoteIpAddress?.ToString();
            await DataService.DeleteFiles(fileGuids, authToken, ipAddress);
            return Ok();
        }

        [Authorize]
        [HttpGet("[action]")]
        public async Task<IEnumerable<FileDescriptionDTO>> Descriptions()
        {
            var user = await UserManager.GetUserAsync(User);
            return (await DataService.GetAllDescriptions(user))?.Select(x => x?.ToDto());    
        }

        [HttpGet("[action]/{authToken}")]
        public async Task<IEnumerable<FileDescriptionDTO>> Descriptions(string authToken)
        {
            var ipAddress = HttpContext?.Connection?.RemoteIpAddress?.ToString();
            return (await DataService.GetAllDescriptions(authToken, ipAddress))?.Select(x => x?.ToDto());
        }

        [HttpGet("[action]/{fileGuid}")]
        public async Task<ActionResult> Display(string fileGuid)
        {
            FileDescription fileDescription;

            if (User.Identity.IsAuthenticated)
            {
                var user = await UserManager.GetUserAsync(User);
                fileDescription = DataService.GetFileDescriptionAndContent(fileGuid, user);
            }
            else
            {
                fileDescription = DataService.GetFileDescriptionAndContent(fileGuid);
            }

            if (fileDescription == null)
            {
                return NotFound();
            }

            return File(fileDescription.Content.Content, fileDescription.ContentType);
        }

        [HttpGet("[action]/{fileGuid}/{authToken}")]
        public ActionResult Display(string fileGuid, string authToken)
        {
            var fileDescription = DataService.GetFileDescriptionAndContent(fileGuid, authToken);

            if (fileDescription == null)
            {
                return NotFound();
            }

            return File(fileDescription.Content.Content, fileDescription.ContentType);
        }

        [HttpGet("[action]/{fileGuid}")]
        public async Task<ActionResult> Download(string fileGuid)
        {
            FileDescription fileDescription;

            if (User.Identity.IsAuthenticated)
            {
                var user = await UserManager.GetUserAsync(User);
                fileDescription = DataService.GetFileDescriptionAndContent(fileGuid, user);
            }
            else
            {
                fileDescription = DataService.GetFileDescriptionAndContent(fileGuid);
            }

            if (fileDescription == null)
            {
                return NotFound();
            }

            var cd = $"form-data; name=\"file\"; filename=\"{fileDescription.FileName}\"";
            Response.Headers.TryAdd("Content-Disposition", cd);
            return File(fileDescription.Content.Content, fileDescription.ContentType);
        }

        [HttpGet("[action]/{fileGuid}/{authToken}")]
        public ActionResult Download(string fileGuid, string authToken)
        {
            var fileDescription = DataService.GetFileDescriptionAndContent(fileGuid, authToken);

            if (fileDescription == null)
            {
                return NotFound();
            }

            var cd = $"form-data; name=\"file\"; filename=\"{fileDescription.FileName}\"";
            Response.Headers.TryAdd("Content-Disposition", cd);
            return File(fileDescription.Content.Content, fileDescription.ContentType);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> TransferFilesToAccount([FromBody]string[] fileGuids)
        {
            var user = await UserManager.GetUserAsync(User);
            await DataService.TransferFilesToAccount(fileGuids, user);
            return Ok();
        }

        // TODO: This should be streamed.
        [RequestSizeLimit(100_000_000)]
        [HttpPost("[action]")]
        public async Task<FileDescriptionDTO> Upload(IFormFile file)
        {
            try
            {
                var fileDescription = GetFileDescription(file);

                if (User.Identity.IsAuthenticated)
                {
                    var user = await UserManager.GetUserAsync(User);
                    fileDescription.User = user;
                }


                await DataService.AddFileDescription(fileDescription);

                return fileDescription.ToDto();
            }
            catch (Exception ex)
            {
                await DataService.WriteEvent(ex);
                throw;
            }
        }

        // TODO: This should be streamed.
        [RequestSizeLimit(100_000_000)]
        [HttpPost("[action]/{authToken}")]
        public async Task<FileDescriptionDTO> Upload(IFormFile file, string authToken)
        {
            try
            {

                var fileDescription = GetFileDescription(file);
                var ipAddress = HttpContext?.Connection?.RemoteIpAddress?.ToString();
                await DataService.AddFileDescription(fileDescription, authToken, ipAddress);

                return fileDescription.ToDto();
            }
            catch (Exception ex)
            {
                await DataService.WriteEvent(ex);
                throw;
            }
        }

        private FileDescription GetFileDescription(IFormFile file)
        {
            byte[] fileBytes;
            using (var fs = file.OpenReadStream())
            {
                using (var sr = new BinaryReader(fs))
                {
                    fileBytes = sr.ReadBytes((int)file.Length);
                }
            }
            var fileContent = new FileContent()
            {
                Content = fileBytes
            };

            return new FileDescription()
            {
                FileName = Path.GetFileName(file.FileName),
                Content = fileContent,
                DateUploaded = DateTime.Now,
                ContentType = file.ContentType,
                ContentDisposition = file.ContentDisposition,
                Size = file.Length,
                Guid = Guid.NewGuid().ToString()
            };
        }
    }
}
