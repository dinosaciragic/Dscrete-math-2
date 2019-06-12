using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BnBBackend.Controllers
{
    [Route("api/Throw")]
    [ApiController]
    public class ThrowController : ControllerBase
    {
        Random random = new Random(Guid.NewGuid().GetHashCode());
        // GET: api/Throw
        [HttpGet("{n}/{m}")]
        public IEnumerable<int[]> GetRandomNumbers([FromRoute] int n, [FromRoute] int m)
        {
           
            int[] array;
            array = new int[m];
            
            for (int i = 0; i < m; i++)
            {
                if (i == m - 1)
                {
                    array[i] = n;
                }
                else
                {
                    array[i] = random.Next(0, n);
                    n = n - array[i];
                }

            }

            yield return array;
        }

        

    }
}