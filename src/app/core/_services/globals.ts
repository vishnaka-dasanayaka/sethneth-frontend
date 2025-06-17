import { environment } from "../../../environments/environment";

// Define global variables for services here

export const GlobalVariable = Object.freeze({
  BaseUrl: environment.baseUrl, // Always use trailing / at the end
  //... more of your variables
});

// ng build --prod --aot
