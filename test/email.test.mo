import { print; trap } "mo:base/Debug";
import Email "../src/backend/Email";

print("# Email");

print("- valid Gmail");

switch (Email.normalize("test@gmail.com")) {
  case (#ok(email)) {
    if (email != "test@gmail.com") trap("unexpected email: " # email);
  };
  case (#err err) trap("could not normalize email: " # err);
};

switch (Email.normalize("test+remove-this-part@gmail.com")) {
  case (#ok(email)) {
    if (email != "test@gmail.com") trap("unexpected email: " # email);
  };
  case (#err err) trap("could not normalize email: " # err);
};

print("- valid Email");

switch (Email.normalize("test+keep-this-part@example.com")) {
  case (#ok(email)) {
    if (email != "test+keep-this-part@example.com") trap("unexpected email: " # email);
  };
  case (#err err) trap("could not normalize email: " # err);
};

print("- invalid Email");

switch (Email.normalize("no.at.sign.gmail.com")) {
  case (#ok(email)) trap("unexpected email: " # email);
  case (#err _err) {};
};
