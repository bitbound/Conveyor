using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Conveyor.Data;
using Conveyor.DTOs;
using Conveyor.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Conveyor.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthTokenController : ControllerBase
    {
        public AuthTokenController(DataService dataService, UserManager<ApplicationUser> userManager)
        {
            DataService = dataService;
            UserManager = userManager;
        }

        private DataService DataService { get; }
        private UserManager<ApplicationUser> UserManager { get; }

        [HttpGet]
        public async Task<IEnumerable<AuthTokenDTO>> Get()
        {
            var user = await UserManager.GetUserAsync(User);
            return DataService.GetAllAuthTokens(user)?.Select(x => x?.ToDto());
        }


        [HttpDelete("[action]/{fileGuid}")]
        public async Task<ActionResult> Delete(string authToken)
        {
            var user = await UserManager.GetUserAsync(User);
            await DataService.DeleteAuthToken(authToken, user);
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<ActionResult> DeleteMany([FromBody]string[] authTokens)
        {
            var user = await UserManager.GetUserAsync(User);
            await DataService.DeleteAuthTokens(authTokens, user);
            return Ok();
        }

        [HttpGet("[action]")]
        public async Task<AuthTokenDTO> New()
        {
            var user = await UserManager.GetUserAsync(User);
            return (await DataService.AddNewToken(user))?.ToDto();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateDescription([FromBody]AuthTokenDTO updatedToken)
        {
            var user = await UserManager.GetUserAsync(User);
            await DataService.UpdateTokenDescription(updatedToken.Token, updatedToken.Description, user);
            return Ok();
        }
    }
}