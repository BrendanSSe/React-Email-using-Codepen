class App extends React.Component {
  constructor(props) {
    super(props);

    const emails = this.props.emails;
    let id = 0;
    for (const email of emails) {
      email.id = id++;
    };
    this.state = {
      currentEmailId: 0,
      currentSection: "inbox",
      emails };

    this.openEmail = this.openEmail.bind(this);
    this.markEmailUnRead = this.markEmailUnRead.bind(this);
    this.getSection = this.getSection.bind(this);
    this.changeEmailLocation = this.changeEmailLocation.bind(this);
    this.closeCompose = this.closeCompose.bind(this);
  }
  unreadEmails() {
    function checkEmailStatus(value) {
      if (value.read === "false") {
        return value;
      }
    }
    let unRead = this.state.emails.filter(checkEmailStatus);
    return unRead;
  }
  deletedEmails() {
    function checkEmailStatus(value) {
      if (value.tag === "deleted") {
        return value;
      }
    }
    let deleted = this.state.emails.filter(checkEmailStatus);
    return deleted;
  }
  spamEmails() {
    function checkEmailStatus(value) {
      if (value.tag === "spam") {
        return value;
      }
    }
    let spam = this.state.emails.filter(checkEmailStatus);
    return spam;
  }
  openEmail(id) {
    const emails = this.state.emails;
    emails[id].read = "true";
    this.setState({
      currentEmailId: id,
      emails });

  }
  markEmailUnRead(id) {
    const emails = this.state.emails;
    emails[id].read = "false";
    this.setState({
      currentEmailId: id,
      emails });

  }
  getSection(value) {
    const emails = this.state.emails;
    if (value !== this.state.currentSection) {
      this.setState({
        currentEmailId: "" });

    }
    this.setState({
      currentSection: value,
      emails });


    if (value === "compose") {
      this.composeEmail(value);
    }

  }
  changeEmailLocation(value, location) {
    const emails = this.state.emails;

    emails[value.id].tag = location;
    this.setState({
      emails });


  }
  composeEmail(value) {
    this.setState({
      currentSection: value });

  }
  closeCompose() {
    this.getSection("inbox");
  }
  render() {
    let currentEmailState = this.state.emails.find(x => x.id === this.state.currentEmailId);
    return /*#__PURE__*/(
      React.createElement("div", { className: "email-app__wrapper" }, /*#__PURE__*/
      React.createElement("div", { className: "row" }, /*#__PURE__*/
      React.createElement(TopBar, {
        getUnreadEmails: this.unreadEmails(),
        getDeletedEmails: this.deletedEmails(),
        getSpamEmails: this.spamEmails(),
        getCurrentSection: this.getSection }), /*#__PURE__*/
      React.createElement(EmailList, {
        emails: this.state.emails.filter(x => x.tag === this.state.currentSection),
        getSelectedEmail: this.openEmail,
        selectedEmail: currentEmailState }), /*#__PURE__*/
      React.createElement(EmailDetails, {
        email: currentEmailState,
        getCurrentSection: this.state.currentSection,
        markUnRead: this.markEmailUnRead,
        changeEmailLocation: this.changeEmailLocation }), /*#__PURE__*/
      React.createElement(Compose, { composeOpen: this.state.currentSection, closeCompose: this.closeCompose, sendMessage: this.sendMessage }))));



  }}


const EmailList = ({ emails, getSelectedEmail, selectedEmail }) => {

  if (emails.length === 0) {
    return /*#__PURE__*/(
      React.createElement("div", { className: "email-list__wrapper col-md-4" }, /*#__PURE__*/
      React.createElement("div", { className: "empty-container" }, /*#__PURE__*/
      React.createElement("div", { className: "empty-container__content" }, "This is empty"))));





  };

  let emailList = emails.map(function (email, i) {
    return /*#__PURE__*/React.createElement(EmailListItem, { email: email, openEmail: getSelectedEmail, selected: selectedEmail === email });
  });
  return /*#__PURE__*/(
    React.createElement("div", { className: "email-list__wrapper col-md-4" }, /*#__PURE__*/
    React.createElement("div", { className: "email-list__container" },
    emailList)));



};

const EmailListItem = ({ email, openEmail, selected }) => {
  var time = splitSeconds(email.time);
  var classes = "email-item";
  if (selected) {
    classes += " active unread";
  }

  return /*#__PURE__*/(
    React.createElement("div", { className: classes, onClick: () => openEmail(email.id) }, /*#__PURE__*/
    React.createElement("div", { className: "email-item__name" }, email.from), /*#__PURE__*/
    React.createElement("div", { className: "email-item__subject" }, /*#__PURE__*/
    React.createElement("strong", null, email.subject)), /*#__PURE__*/

    React.createElement("div", { className: "email-item__read", "data-read": email.read }), /*#__PURE__*/
    React.createElement("div", { className: "email-item__time" }, time), /*#__PURE__*/

    React.createElement("div", { className: "email-item__message" }, /*#__PURE__*/React.createElement("p", null, truncateString(email.message, 85)))));


};

const EmailDetails = ({ email, markUnRead, getCurrentSection, changeEmailLocation }) => {
  if (!email) {
    return /*#__PURE__*/(
      React.createElement("div", { className: "email-details__wrapper col-md-8" }, /*#__PURE__*/
      React.createElement("div", { className: "empty-container" }, /*#__PURE__*/
      React.createElement("div", { className: "empty-container__content" }))));






  }

  return /*#__PURE__*/(
    React.createElement("div", { className: "email-details__wrapper col-md-8" }, /*#__PURE__*/
    React.createElement("div", { className: "email-details__container" }, /*#__PURE__*/
    React.createElement("div", { className: "email-details__header" }, /*#__PURE__*/
    React.createElement("div", { className: "email-details__info" }, /*#__PURE__*/
    React.createElement("strong", null, email.from, " ", "<", email.address, ">"), /*#__PURE__*/
    React.createElement("span", { className: "pull-right" }, prettyDate(email.time))), /*#__PURE__*/

    React.createElement("div", null, email.subject), /*#__PURE__*/
    React.createElement("div", { className: "email-details__buttons" }, /*#__PURE__*/
    React.createElement("div", { className: "email-details__mark" }, /*#__PURE__*/
    React.createElement("span", { onClick: () => {markUnRead(email.id);} }, /*#__PURE__*/React.createElement("i", { className: "fa fa-envelope-o markUnread", "aria-hidden": "true" }))), /*#__PURE__*/

    React.createElement("div", { className: "email-details__mark" }, /*#__PURE__*/
    React.createElement("span", { onClick: () => {changeEmailLocation(email, "spam");} }, /*#__PURE__*/React.createElement("i", { className: "fa fa-ban spam", "aria-hidden": "true" }))), /*#__PURE__*/

    React.createElement("div", { className: "email-details__mark" }, /*#__PURE__*/
    React.createElement("span", { onClick: () => {changeEmailLocation(email, "deleted");} }, /*#__PURE__*/React.createElement("i", { className: "fa fa-trash-o trash", "aria-hidden": "true" }))))), /*#__PURE__*/



    React.createElement("div", { className: "email-details__message" }, /*#__PURE__*/
    React.createElement("p", null, email.message)))));





};

const TopBar = ({ getUnreadEmails, getDeletedEmails, getSpamEmails, getCurrentSection }) => {
  return /*#__PURE__*/(
    React.createElement("div", { className: "topbar col-md-12" }, /*#__PURE__*/
    React.createElement("ul", null, /*#__PURE__*/
    React.createElement("li", { className: "close-icons" }, /*#__PURE__*/
    React.createElement("span", null), /*#__PURE__*/
    React.createElement("span", null), /*#__PURE__*/
    React.createElement("span", null)), /*#__PURE__*/


    React.createElement("li", { onClick: () => getCurrentSection("inbox") }, "InBox ", /*#__PURE__*/React.createElement("span", null, getUnreadEmails.length)), /*#__PURE__*/
    React.createElement("li", { onClick: () => getCurrentSection("spam") }, "Spam ", getSpamEmails.length), /*#__PURE__*/
    React.createElement("li", { onClick: () => getCurrentSection("deleted") }, "Trash ", getDeletedEmails.length), /*#__PURE__*/
    React.createElement("li", { className: "pull-right white" }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", { className: "fa fa-search", "aria-hidden": "true" }))), /*#__PURE__*/
    React.createElement("li", { onClick: () => getCurrentSection("compose") }, /*#__PURE__*/React.createElement("span", null, "Compose")))));



};

const Compose = ({ composeOpen, closeCompose, sendMessage }) => {
  if (composeOpen === "compose") {
    return /*#__PURE__*/(
      React.createElement("div", { className: "compose-email__wrapper" }, /*#__PURE__*/
      React.createElement("div", { className: "compose-email__content" }, /*#__PURE__*/
      React.createElement("div", { className: "compose-email__message" }, /*#__PURE__*/
      React.createElement("div", { className: "compose-email__header", onClick: () => closeCompose() }, "New Message", /*#__PURE__*/

      React.createElement("span", { className: "white pull-right" }, /*#__PURE__*/
      React.createElement("i", { className: "fa fa-times", "aria-hidden": "true" }))), /*#__PURE__*/



      React.createElement("div", { className: "compose-email__body" }, /*#__PURE__*/
      React.createElement("div", { className: "compose-email__toemail" }, /*#__PURE__*/
      React.createElement("input", { placeholder: "To:" })), /*#__PURE__*/

      React.createElement("div", { className: "compose-email__subject" }, /*#__PURE__*/
      React.createElement("input", { placeholder: "Subject:" })), /*#__PURE__*/

      React.createElement("div", { className: "compose-email__message-content" }, /*#__PURE__*/
      React.createElement("textarea", { rows: "6", placeholder: "Type Your Message Here" }))), /*#__PURE__*/


      React.createElement("div", { className: "compose-email__footer" }, /*#__PURE__*/
      React.createElement("button", null, "Send"))))));





  };
  return /*#__PURE__*/(
    React.createElement("div", null));

};

$.ajax({ url: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/311743/dummy-emails.json',
  type: 'GET',
  success: function (result) {
    ReactDOM.render( /*#__PURE__*/React.createElement(App, { emails: result }), document.getElementById('email-app'));
  } });


//  Helpers
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const splitSeconds = date => {
  let time = date.split(" ")[1].split(":");
  return `${time[0]}:${time[1]}`;
};

const prettyDate = date => {
  let newdate = date.split(" ")[0].split("-");
  let month = months[newdate[1] - 1];
  let day = newdate[2];
  let year = newdate[0];
  return date = month + " " + day + ", " + year;
};

prettyDate("2016-10-07 15:35:14");
const truncateString = (string, length) => {
  return string.substring(0, length) + "...";
};