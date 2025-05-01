resource "aws_s3_object" "icons" {
  for_each = { for icon in local.icons : icon => icon }

  bucket       = var.bucket_id
  key          = "${local.iconsTargetPath}/${each.value}"
  source       = "${path.module}/${local.iconsPath}/${each.value}"
  acl          = "public-read"
  content_type = "image/png"
}
