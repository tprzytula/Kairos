locals {
  icons           = fileset("${path.module}/../../../assets/icons", "*.png")
  iconsPath       = "icons"
  iconsTargetPath = "assets/icons"
}
