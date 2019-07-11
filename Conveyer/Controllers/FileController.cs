using Conveyer.Data;
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
        private FileExtensionContentTypeProvider FileExtProv { get; }
        private UserManager<ApplicationUser> UserManager { get; }
        private DataService DataService { get; }

        public FileController(FileExtensionContentTypeProvider fileExtProv, 
            UserManager<ApplicationUser> userManager,
            DataService dataService)
        {
            FileExtProv = fileExtProv;
            UserManager = userManager;
            DataService = dataService;
        }

        [HttpGet("[action]")]
        public ActionResult Download()
        {
            return null;
        }

        [HttpGet("[action]")]
        public ActionResult Display()
        {
            return null;
        }

        [RequestSizeLimit(100_000_000)]
        [HttpPost("[action]")]
        public async Task<IActionResult> Upload(IFormFile file)
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
                    FileName = file.Name,
                    Content = fileContent,
                    DateUploaded = DateTime.Now,
                    ContentType = file.ContentType,
                    ContentDisposition = file.ContentDisposition,
                    Size = file.Length
                };

                if (User.Identity.IsAuthenticated)
                {
                    var user = await UserManager.GetUserAsync(User);
                    fileDescription.User = user;
                }
                await DataService.AddFileDescription(fileDescription);
                return Ok();
            }
            catch (Exception ex)
            {
                await DataService.WriteEvent(ex);
                throw;
            }
        }
    }
}
