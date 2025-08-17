import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { OrderService } from "../../../core/_services/order.service";
import swal from "sweetalert2";
import { InvoiceService } from "../../../core/_services/invoice.service";
import { SharedService } from "../../../core/_services/shared.service";

@Component({
  selector: "app-invoice-detail",
  standalone: false,
  templateUrl: "./invoice-detail.component.html",
  styleUrl: "./invoice-detail.component.css",
})
export class InvoiceDetailComponent {
  uniqueid: any;
  sysuser: any;
  LoadUI: boolean = false;

  private sub: any;
  id!: number;
  inv: any;
  inv_items: any[] = [];

  loading: boolean = false;

  note: any;
  cols: any[] = [];

  constructor(
    private authservice: AuthenticationService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private orderService: OrderService,
    private invoiceService: InvoiceService,
    private sharedService: SharedService
  ) {
    this.cols = [
      { field: "item", header: "Item", sortable: true },
      { field: "desc", header: "Description", sortable: true },
      { field: "qty", header: "QTY", sortable: true },
      { field: "unit_price", header: "Unit Price", sortable: true },
      { field: "discount", header: "Discount", sortable: true },
      { field: "total", header: "Total", sortable: true },
      { field: "actions", header: "Actions", sortable: true },
    ];
  }

  ngOnInit(): void {
    this.generateUniqueKey();
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
    });

    this.sub = this.route.params.subscribe((params) => {
      this.id = +params["id"];
      this.getData(this.id);
    });
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }

  getData(id: number) {
    this.invoiceService.getInvoice({ id: id }).subscribe((data) => {
      if (data.status) {
        this.inv = data.inv;
        this.LoadUI = true;
      }
    });

    this.invoiceService.getInvoiceItems({ id: id }).subscribe((data) => {
      if (data.status) {
        this.inv_items = data.inv_items;
      }
    });
  }

  updateStatus(value: number) {
    return;
    statusString = "";
    if (value == -2) {
      var statusString = "Cancelled";
    }
    if (value == 0) {
      var statusString = "Pending";
    }
    if (value == 2) {
      var statusString = "Sent to the workshop";
    }
    if (value == 4) {
      var statusString = "Received from workshop";
    }
    if (value == 10) {
      var statusString = "Delivered";
    }
    swal
      .fire({
        title:
          "Please confirm that you want to mark this inv as " + statusString,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745", // ✅ Green button
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
        customClass: {
          title: "swal-title-sm",
          confirmButton: "swal-confirm-sm",
          cancelButton: "swal-cancel-sm",
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          var obj = {
            status: value,
            id: this.id,
            uniquekey: this.uniqueid,
          };
          this.orderService.updateOrderStatus(obj).subscribe(
            (data) => {
              if (data.status) {
                this.toastr.success(
                  "Order status has been updated successfully.",
                  "Success",
                  {
                    positionClass: "toast-top-right",
                    closeButton: true,
                    timeOut: 3000,
                    progressBar: true,
                    toastClass: "toast toast-sm", // <-- add your small class here
                  }
                );

                this.generateUniqueKey();
                this.getData(this.id);
              } else {
                this.toastr.warning(data.err, "ERROR !!", {
                  positionClass: "toast-top-right",
                  closeButton: true,
                });
                this.generateUniqueKey();
              }
            },
            (error) => {
              alert("API ERROR [ERRCODE:001]");
            }
          );
        }
      });
  }

  openAddModal() {
    this.sharedService.setInvoiceItemData({ navigate: true, inv_id: this.id });
    this.sharedService.openAddInvoiceItemModal();
  }
}
