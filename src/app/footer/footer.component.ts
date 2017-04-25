import { Component } from '@angular/core';
@Component({
  selector: 'eo-footer',
  template: `
  <div id="footer">
    <p>
        Fisher Controls International, Inc.
        Site Last Updated: 2017-01-12
        <br />
        Page Owner:<a href="mailto:itservicedesk@emerson.com">IT Service Desk</a><br />
        <span>Contents of the Emerson Process Management Intranet are for
            internal use only.<br />
            Copyright ©2017
            Emerson Process Management. All rights reserved. </span>
    </p>
    </div>
  `,
  styles:[`
    #footer
    {
        clear:both;
        font-size:0.8em;
        color:black;
        border-top:1px solid #D3D3D3;
        margin-top:10px;
        padding-top:1px;
        margin: 0 auto;
        }
        #footer a {
          color:blue;
        }
    #footer p
    {
        text-align: center; font-size:0.8em; font-family: Arial;
        }
  `]
})
export class FooterComponent { }