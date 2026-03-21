import Text "mo:core/Text";
import Map "mo:core/Map";
import Order "mo:core/Order";

actor {
  type Contact = {
    name : Text;
    email : Text;
    message : Text;
  };

  module Contact {
    public func compare(contact1 : Contact, contact2 : Contact) : Order.Order {
      switch (Text.compare(contact1.name, contact2.name)) {
        case (#equal) { Text.compare(contact1.email, contact2.email) };
        case (order) { order };
      };
    };
  };

  let dataStore = Map.empty<Text, Contact>();

  public shared ({ caller }) func submitContact(contact : Contact) : async () {
    dataStore.add(contact.name, contact);
  };

  public query ({ caller }) func getAllSubmissions() : async [Contact] {
    dataStore.values().toArray().sort();
  };
};
