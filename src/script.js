class App extends React.Component {
  constructor(props) {
    super(props);
    
    const emails = this.props.emails;
    let id = 0;
    for (const email of emails) {
        email.id = id++;
    };
    this.state = {
        currentEmailId : 0,
        currentSection: "inbox",
        emails
    };
    this.openEmail = this.openEmail.bind(this);
    this.markEmailUnRead = this.markEmailUnRead.bind(this);
    this.getSection = this.getSection.bind(this);
    this.changeEmailLocation = this.changeEmailLocation.bind(this);
    this.closeCompose = this.closeCompose.bind(this);
  };
  unreadEmails() {
      function checkEmailStatus(value) {
          if (value.read === "false") {
              return value
          } 
      }
      let unRead = this.state.emails.filter(checkEmailStatus)
      return unRead
  }
  deletedEmails() {
      function checkEmailStatus(value) {
          if (value.tag === "deleted") {
              return value
          } 
      }
      let deleted = this.state.emails.filter(checkEmailStatus)
      return deleted
  }
  spamEmails() {
      function checkEmailStatus(value) {
          if (value.tag === "spam") {
              return value
          } 
      }
      let spam = this.state.emails.filter(checkEmailStatus)
      return spam
  }
  openEmail(id) {
      const emails = this.state.emails;
      emails[id].read = "true"
      this.setState({
          currentEmailId: id,
          emails
      });
  };
  markEmailUnRead(id) {
      const emails = this.state.emails;
      emails[id].read = "false"
      this.setState({
          currentEmailId: id,
          emails
      });
  }
  getSection(value) {
    const emails = this.state.emails;
    if(value !== this.state.currentSection) {
        this.setState({
            currentEmailId: ""
        });
    }
    this.setState({
        currentSection: value,
        emails
    });
    
    if(value === "compose") {
        this.composeEmail(value);
    }
    
  }
  changeEmailLocation(value, location) {
      const emails = this.state.emails;
      
      emails[value.id].tag = location
      this.setState({
          emails
      });
      
  }
  composeEmail(value) {
      this.setState({
          currentSection: value
      })
  };
  closeCompose() {
      this.getSection("inbox");
  }
  render() {
    let currentEmailState = this.state.emails.find(x => x.id === this.state.currentEmailId);
    return (
      <div className="email-app__wrapper">
        <div className="row">
          <TopBar 
            getUnreadEmails={this.unreadEmails()} 
            getDeletedEmails={this.deletedEmails()} 
            getSpamEmails={this.spamEmails()} 
            getCurrentSection={this.getSection}/>
          <EmailList 
            emails={this.state.emails.filter(x => x.tag === this.state.currentSection)} 
            getSelectedEmail={this.openEmail} 
            selectedEmail={currentEmailState}/>
          <EmailDetails 
            email={currentEmailState} 
            getCurrentSection={this.state.currentSection}
            markUnRead={this.markEmailUnRead}
            changeEmailLocation={this.changeEmailLocation}/>
          <Compose composeOpen={this.state.currentSection} closeCompose={this.closeCompose} sendMessage={this.sendMessage} />
        </div>
     </div>
    );
  }
}

const EmailList = ({emails, getSelectedEmail, selectedEmail }) => {
  
    if(emails.length === 0) {
        return (
            <div className="email-list__wrapper col-md-4">
                <div className="empty-container">
                    <div className="empty-container__content">
                        This is empty  
                    </div>
                </div>
            </div>
        )
    };
  
    let emailList = emails.map(function(email, i) {    
        return <EmailListItem email={email} openEmail={getSelectedEmail} selected={selectedEmail === email}/>
    })
    return (
        <div className="email-list__wrapper col-md-4">
            <div className="email-list__container">
              {emailList}
            </div>
        </div>
    );
};

const EmailListItem = ({ email, openEmail, selected  }) => {
    var time = splitSeconds(email.time)
    var classes = "email-item";
    if(selected) {
        classes += " active unread";
    }
     
    return (
        <div className={classes} onClick={() => openEmail(email.id)}>
          <div className="email-item__name">{email.from}</div>
          <div className="email-item__subject">
            <strong>{email.subject}</strong>
          </div>
          <div className="email-item__read" data-read={email.read}></div>
          <div className="email-item__time">{time}</div>
          
          <div className="email-item__message"><p>{truncateString(email.message, 85)}</p></div>
        </div>  
    );
};

const EmailDetails = ({ email, markUnRead, getCurrentSection, changeEmailLocation }) => {
    if(!email) {
        return (
            <div className="email-details__wrapper col-md-8">
                <div className="empty-container">
                    <div className="empty-container__content">
                       
                    </div>
                </div>
            </div>
          
        )
    }

    return (
        <div className="email-details__wrapper col-md-8">
            <div className="email-details__container">
              <div className="email-details__header">
                <div className="email-details__info">
                    <strong>{email.from} {"<"}{email.address}{">"}</strong>
                    <span className="pull-right">{prettyDate(email.time)}</span>
                </div>
                <div>{email.subject}</div>
                <div className="email-details__buttons">
                  <div className="email-details__mark">
                    <span onClick={() => {markUnRead(email.id)}}><i className="fa fa-envelope-o markUnread" aria-hidden="true"></i></span>
                  </div>
                  <div className="email-details__mark">
                    <span onClick={() => {changeEmailLocation(email, "spam")}}><i className="fa fa-ban spam" aria-hidden="true"></i></span>
                  </div>
                  <div className="email-details__mark">
                    <span onClick={() => {changeEmailLocation(email, "deleted")}}><i className="fa fa-trash-o trash" aria-hidden="true"></i></span>
                  </div>
              </div>
              </div>
              <div className="email-details__message">
                  <p>{email.message}</p>
              </div>
              
            </div>
        </div>
    )
}

const TopBar = ({ getUnreadEmails, getDeletedEmails, getSpamEmails, getCurrentSection }) => {    
    return (
       <div className="topbar col-md-12">
          <ul>
            <li className="close-icons">
              <span></span>
              <span></span>
              <span></span>
            </li>
            
            <li onClick={() => getCurrentSection("inbox")}>InBox <span>{getUnreadEmails.length}</span></li>
            <li onClick={() => getCurrentSection("spam")}>Spam {getSpamEmails.length}</li>
            <li onClick={() => getCurrentSection("deleted")}>Trash {getDeletedEmails.length}</li>
            <li className="pull-right white"><span><i className="fa fa-search" aria-hidden="true"></i></span></li>
            <li onClick={() => getCurrentSection("compose")}><span>Compose</span></li>
          </ul>  
       </div>
    )
}

const Compose = ({ composeOpen, closeCompose, sendMessage }) => {
    if(composeOpen === "compose") {
        return (
          <div className="compose-email__wrapper">
              <div className="compose-email__content">
                  <div className="compose-email__message">
                      <div className="compose-email__header" onClick={() => closeCompose()}>
                          New Message
                          <span  className="white pull-right">
                            <i className="fa fa-times" aria-hidden="true"></i>
                          </span>
                      </div>
                    
                      <div className="compose-email__body">
                          <div className="compose-email__toemail">
                            <input placeholder="To:"/>
                          </div>
                          <div className="compose-email__subject">
                            <input placeholder="Subject:"/>
                          </div>
                          <div className="compose-email__message-content">
                            <textarea rows="6" placeholder="Type Your Message Here"></textarea>
                          </div>
                      </div>
                      <div className="compose-email__footer">
                          <button>Send</button>
                      </div>
                  </div>
              </div>
          </div>
        )
    };
    return (
        <div></div>
    )
}

$.ajax({url: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/311743/dummy-emails.json',
	type: 'GET',
	success: function(result) {
		ReactDOM.render(<App emails={result}/>, document.getElementById('email-app'))
	}
});

//  Helpers
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

const splitSeconds = ( date ) => {
    let time = date.split(" ")[1].split(":");
    return `${time[0]}:${time[1]}`
};

const prettyDate = (date) => {
    let newdate = date.split(" ")[0].split("-");
    let month = months[newdate[1] - 1];
    let day = newdate[2];
    let year = newdate[0];
    return date = month + " " + day + ", " + year
}

prettyDate("2016-10-07 15:35:14")
const truncateString = ( string, length ) => {
    return string.substring(0, length) + "..."
}
