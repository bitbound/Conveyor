using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Conveyer.Controllers
{
    [Route("api/[controller]")]
    public class FileController : Controller
    {
        public FileExtensionContentTypeProvider FileExtProv { get; }

        public FileController(FileExtensionContentTypeProvider fileExtProv)
        {
            FileExtProv = fileExtProv;
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
            return null;
        }
    }
}
