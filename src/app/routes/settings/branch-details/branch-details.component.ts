import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from "@angular/core";
import swal from "sweetalert2";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SettingsService } from "../../../core/_services/settings.service";
import { BranchesService } from "../../../core/_services/branches.service";

declare var google: any;

@Component({
  selector: "app-branch-details",
  standalone: false,
  templateUrl: "./branch-details.component.html",
  styleUrl: "./branch-details.component.css",
})
export class BranchDetailsComponent {
  @ViewChild("mapContainer") mapElement!: ElementRef;
  @ViewChild("searchInput") searchInput!: ElementRef;

  uniqueid: any;
  sysuser: any;
  LoadUI: boolean = false;

  private sub: any;
  id!: number;
  branch: any;

  selectedAddress: string | null = null;
  geocoder = new google.maps.Geocoder();

  selectedLat: number | null = null;
  selectedLng: number | null = null;

  mapInitialized = false;

  map: any;
  marker: any;

  constructor(
    private authservice: AuthenticationService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private settingsService: SettingsService,
    private cdr: ChangeDetectorRef,
    private branchService: BranchesService,
  ) {}

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

  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap() {
    const mapEl = this.mapElement?.nativeElement;
    const inputEl = this.searchInput?.nativeElement;

    if (!mapEl) {
      console.error("Map element not found in DOM");
      return;
    }

    // Ensure the container has height before Google Maps starts
    this.map = new google.maps.Map(mapEl, {
      center: {
        lat: this.branch?.latitude || 6.9271,
        lng: this.branch?.longitude || 79.8612,
      },
      zoom: 16,
    });

    // 2. ATTACH LISTENER HERE - Now this.map is guaranteed to exist
    this.map.addListener("click", (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.setMarker(lat, lng);
    });

    const searchBox = new google.maps.places.SearchBox(inputEl);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputEl);

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (!places || !places[0].geometry) return;

      const location = places[0].geometry.location;
      this.setMarker(location.lat(), location.lng());
    });
  }

  confirmLocation() {
    if (this.selectedRadius <= 10) {
      swal.fire({
        title: "Warning!",
        text: "Radius cannot be less than 10",
        icon: "warning",
        confirmButtonColor: "#ff820d",
      });
      return;
    }
    const payload = {
      lat: this.selectedLat,
      long: this.selectedLng,
      branch_id: this.id,
      rad: this.selectedRadius,
    };

    this.branchService.addLatLong(payload).subscribe((data) => {
      if (data.status) {
        this.toastr.success(
          "Branch location has been updated successfully.",
          "Success",
          {
            positionClass: "toast-top-right",
            closeButton: true,
            timeOut: 3000,
            progressBar: true,
            toastClass: "toast toast-sm", // <-- add your small class here
          },
        );

        this.getData(this.id);
      }
    });
  }

  setMarker(lat: number, lng: number) {
    this.selectedLat = lat;
    this.selectedLng = lng;

    if (this.marker) this.marker.setMap(null);
    this.marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
    });

    this.drawRadiusCircle(lat, lng);

    // 3. Get Address Name (Reverse Geocoding)
    this.geocoder.geocode(
      { location: { lat, lng } },
      (results: any, status: any) => {
        if (status === "OK" && results![0]) {
          this.selectedAddress = results![0].formatted_address;
        } else {
          this.selectedAddress = "Unknown Location";
        }

        // 4. CRITICAL: Tell Angular to update the UI
        this.cdr.detectChanges();
      },
    );

    const mapEl = this.mapElement?.nativeElement;
    const inputEl = this.searchInput?.nativeElement;

    if (!mapEl || !inputEl) return;

    this.map.panTo({ lat, lng });
  }

  selectedRadius: number = 100; // Default to 500m
  circle: any; // To visually show the radius on the map

  onRadiusChange() {
    if (this.selectedLat && this.selectedLng) {
      this.drawRadiusCircle(this.selectedLat, this.selectedLng);
    }
  }

  drawRadiusCircle(lat: number, lng: number) {
    // Remove existing circle if any
    if (this.circle) {
      this.circle.setMap(null);
    }

    // Draw a visual representation of the radius
    this.circle = new google.maps.Circle({
      strokeColor: "#ff820d",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#ff820d",
      fillOpacity: 0.2,
      map: this.map,
      center: { lat, lng },
      radius: this.selectedRadius,
    });
  }
  onTabSelectionChange(value: any) {
    console.log("GGG");

    // Convert value to string/number depending on what you used in the template
    if (value == "1") {
      console.log("Location tab active");

      // Give the DOM a millisecond to render the tab content
      setTimeout(() => {
        if (!this.map) {
          this.loadMap();
        } else {
          // Force the map to recognize its new container size
          google.maps.event.trigger(this.map, "resize");
          this.map.setCenter({
            lat: this.selectedLat || 6.9271,
            lng: this.selectedLng || 79.8612,
          });
        }
      }, 50);
    }
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }

  getData(id: number) {
    this.settingsService.getBranch(id).subscribe((data) => {
      if (data.status) {
        this.branch = data.branch;
        this.LoadUI = true;
        this.selectedRadius = this.branch.radius || 0;

        this.setMarker(
          this.branch.latitude || 6.9271,
          this.branch.longitude || 79.8612,
        );
      }
    });
  }

  updateStatus(value: number) {
    statusString = "";
    if (value == 1) {
      var statusString = "Activate";
    }
    if (value == 0) {
      var statusString = "Deactivate";
    }

    swal
      .fire({
        title:
          "Please confirm that you want to make this branch " + statusString,
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
          this.settingsService.updateBranchStatus(obj).subscribe(
            (data) => {
              if (data.status) {
                this.toastr.success(
                  "Branch status has been updated successfully.",
                  "Success",
                  {
                    positionClass: "toast-top-right",
                    closeButton: true,
                    timeOut: 3000,
                    progressBar: true,
                    toastClass: "toast toast-sm", // <-- add your small class here
                  },
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
            },
          );
        }
      });
  }

  // openInvoiceEditModal() {
  //   if (this.branch.status != 0) {
  //     swal.fire({
  //       title: "Warning!",
  //       text: "Order Should be in pending status to edit",
  //       icon: "warning",
  //       confirmButtonColor: "#ff820d",
  //     });
  //     return;
  //   }

  //   var obj = {
  //     patient_id: this.branch.patient_id.id,
  //     id: this.branch.id,
  //   };

  //   this.sharedService.setInvoiceData(obj);
  //   this.sharedService.openEditInvoiceModal();
  // }
}
