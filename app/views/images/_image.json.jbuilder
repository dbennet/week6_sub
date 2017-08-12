json.extract! image, :id, :caption, :position, :creator_id, :created_at, :updated_at
json.url image_url(image, format: :json)
json.content_url image_content_url(image)
json.user_roles image.user_roles     unless image.user_roles.empty?
if image.respond_to?(:lng)
	if image.lng && image.lat
  		json.lng image.lng
  		json.lat image.lat
	end
end
if image.respond_to?(:distance)
	if image.distance && image.distance >= 0
  		json.distance image.distance.to_f
	end
end
