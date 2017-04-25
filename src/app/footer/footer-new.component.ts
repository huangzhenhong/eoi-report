import { Component } from '@angular/core';
@Component({
  selector: 'eon-footer',
  template: `
  <div id="footer">
    <p>
        @2017 Emerson <br>
        Contact Support:<a href="mailto:itservicedesk@emerson.com">IT Service Desk</a>
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
        padding-top:20px;
        margin: 0 auto;
        padding-left: 20px;
        }
        #footer a {
          color:blue;
        }
    #footer p
    {
         font-size:1em; font-family: Arial;
        }
  `]
})
export class NewFooterComponent { }