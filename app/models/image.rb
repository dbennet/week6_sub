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

  scope :exclude_images, ->(id) {
    where('images.id not in (?)', id)
  }
  scope :location_exists, -> {
    where('images.lng is not null and images.lat is not null')
  }
  scope :within_range, ->(origin, limit=nil, reverse=false) {
    scope=location_exists
    scope=scope.within(limit,:origin=>origin)                   if limit
    scope=scope.by_distance(:origin=>origin, :reverse=>reverse) unless reverse.nil?
    return scope
  }

  def self.with_distance(origin, scope)
    scope.select("*, -1.0 as distance")
         .each {|i| i.distance = i.distance_from(origin) }
  end
 
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
