import LightningDatatable from "lightning/datatable";
import customImageTemplate from "./customImage.html";
export default class CustomDataType extends LightningDatatable  {

    static customTypes = {
        customImage: {
          template: customImageTemplate,
          standardCellLayout: false,
          typeAttributes: ["imageUrl"],
        }
      };
}