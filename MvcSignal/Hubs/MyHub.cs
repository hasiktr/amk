using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using MvcSignal.Models;
using Microsoft.AspNet.SignalR.Hubs;
using System.Threading.Tasks;

namespace MvcSignal
{
    public class MyHub : Hub
    {
        public void Connect(string userName, string password, string channel)
        {
            var id = Context.ConnectionId;
            string userGroup = "";


            var ctx = new TestEntities();

             
            try
            {

                var userInfo = (from m in ctx.tbl_User
                                where m.UserName == userName && m.Password == password
                                select new { m.UserID, m.UserName, m.AdminCode }).FirstOrDefault();

                Groups.Add(Context.ConnectionId, channel);
                Clients.Caller.onConnected(id, userName, userInfo.UserID, userGroup); 
            }

            catch (Exception ex)
            {
                string msg = "All Administrators are busy, please be patient and try again";
                //***** Return to Client *****
                Clients.Caller.NoExistAdmin();

            }


        }
        // <<<<<-- ***** Return to Client [  NoExist  ] *****



        //--group ***** Receive Request From Client [  SendMessageToGroup  ] *****
        public void SendMessageToGroup(string userName, string message, string channel)
        {

            // If you want to Broadcast message to all UsersList use below line
            // Clients.All.getMessages(userName, message);

            //If you want to establish peer to peer connection use below line so message will be send just for user and admin who are in same group
            //***** Return to Client *****
            Clients.Group(channel).getMessages(userName, message);


        }
        // <<<<<-- ***** Return to Client [  getMessages  ] *****


        //--group ***** Receive Request From Client ***** { Whenever User close session then OnDisconneced will be occurs }
        public override System.Threading.Tasks.Task OnDisconnected()
        {

            return base.OnDisconnected();
        }
        public override Task OnConnected()
        {
            //var username = Context.QueryString["username"];
            return base.OnConnected();
        }

    }
}