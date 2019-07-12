using Conveyer.Data;
using Conveyer.DTOs;
using Conveyer.Models;
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

namespace Conveyer.Controllers
{
    [Route("api/[controller]")]
    public class FileController : Controller
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


        [Authorize]
        [HttpGet("[action]")]
        public async Task<ActionResult> Descriptions()
        {
            var user = await UserManager.GetUserAsync(User);
            var descriptions = DataService.GetAllDescriptions(user.Id);
            return Json(descriptions);
        }

        [HttpGet("[action]/{guid}")]
        public async Task<ActionResult> Display(string guid)
        {
            return null;
        }

        [HttpGet("[action]/{guid}")]
        public async Task<ActionResult> Download(string guid)
        {
            FileDescription fileDescription;

            if (User.Identity.IsAuthenticated)
            {
                var user = await UserManager.GetUserAsync(User);
                fileDescription = DataService.GetFileDescriptionAndContent(guid, user.Id);
            }
            else
            {
                fileDescription = DataService.GetFileDescriptionAndContent(guid);
            }

            if (fileDescription == null)
            {
                return NotFound();
            }

            Response.ContentType = fileDescription.ContentType;

            return File(fileDescription.Content.Content, fileDescription.ContentType);
        }

        [RequestSizeLimit(100_000_000)]
        [HttpPost("[action]")]
        public async Task<FileDescriptionDTO> Upload(IFormFile file)
        {
            try
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
                var fileDescription = new FileDescription()
                {
                    FileName = file.FileName,
                    Content = fileContent,
                    DateUploaded = DateTime.Now,
                    ContentType = file.ContentType,
                    Size = file.Length,
                    Guid = Guid.NewGuid().ToString()
                };

                if (User.Identity.IsAuthenticated)
                {
                    var user = await UserManager.GetUserAsync(User);
                    fileDescription.User = user;
                }
                await DataService.AddFileDescription(fileDescription);

                return new FileDescriptionDTO()
                {
                    FileName = Path.GetFileName(fileDescription.FileName),
                    ContentType = fileDescription.ContentType,
                    DateUploaded = fileDescription.DateUploaded,
                    Guid = fileDescription.Guid,
                    Id = fileDescription.Id,
                    SizeInKb = Math.Round(fileDescription.Size / (decimal)1024, 2)
                };
            }
            catch (Exception ex)
            {
                await DataService.WriteEvent(ex);
                throw;
            }
        }
    }
}
