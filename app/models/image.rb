class Image < ActiveRecord::Base
  include Protectable
  attr_accessor :image_content

  has_many :thing_images, inverse_of: :image, dependent: :destroy
  has_many :things, through: :thing_images

  composed_of :position,
              class_name:"Point",
              allow_nil: true,
              mapping: [%w(lng lng), %w(lat lat)]

  acts_as_mappable

  scope :within_range, ->(origin, limit=nil) {
    scope = by_distance(origin: origin, reverse: false) 
    scope = scope.within(limit,origin: origin) if limit 
    return scope
  }
  
  scope :include_ids, ->(ids){
    where(id: ids) if ids.present?
  }
 
  def Image.last_modified
    Image.maximum(:updated_at)
  end
 

  def to_lat_lng
    Geokit::LatLng.new(lat,lng)
  end

  def basename
    caption || "image-#{id}"
  end
end

Point.class_eval do
  def to_lat_lng
    Geokit::LatLng.new(*latlng)
  end
end
