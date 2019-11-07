using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Owin;
using System.Threading.Tasks;
using System.Web.Cors;

[assembly: OwinStartup(typeof(MvcSignal.Startup))]
namespace MvcSignal
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var policy = new CorsPolicy()
            {
                AllowAnyHeader = true,
                AllowAnyMethod = true,
                SupportsCredentials = true
            };

         policy.Origins.Add("http://localhost:5090"); //be sure to include the port: 

            //   policy.Origins.Add("http://51.89.27.18"); //be sure to include the port:

            app.UseCors(new CorsOptions
            {
                PolicyProvider = new CorsPolicyProvider
                {
                    PolicyResolver = context => Task.FromResult(policy)
                }
            });

            app.MapSignalR();
        }
    }
}