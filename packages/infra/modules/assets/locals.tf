locals {
  icons           = fileset("${path.module}/icons", "*.png")
  iconsPath       = "icons"
  iconsTargetPath = "assets/images"
}
