import Text "mo:core/Text";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";



actor {
  type ContactSubmission = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
  };

  let dataStore = Map.empty<Text, ContactSubmission>();
  let adminPassword = "5elements";

  public shared ({ caller }) func submitContact(name : Text, email : Text, message : Text) : async () {
    let contact : ContactSubmission = {
      name;
      email;
      message;
      timestamp = Time.now();
    };
    dataStore.add(name, contact);
  };

  public query ({ caller }) func getSubmissions(password : Text) : async ?[ContactSubmission] {
    if (password != adminPassword) { return null };
    ?dataStore.values().toArray();
  };
};

