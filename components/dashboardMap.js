import { Box, useToken } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useState } from 'react'
import {
  CircleMarker,
  FeatureGroup,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
  ZoomControl,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import NextLink from 'next/link'

export default function DashboardMap({ markers }) {
  const [popup, setPopup] = useState(null)

  return (
    <Box
      boxSize="100%"
      sx={{
        '.leaflet-popup-content-wrapper': {
          rounded: 'md',
          shadow: 'lg',
          p: '0',
          overflow: 'hidden',
        },
        '.leaflet-popup-content': {
          m: '0',
          p: '0',
        },
        '&& .leaflet-popup-close-button': {
          d: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSize: '6',
          p: '4',
        },
      }}
    >
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        center={[42.886, -78.879]}
        zoom={13}
        preferCanvas={true}
        zoomControl={false}
      >
        <ZoomControl position="topright" />
        <TileLayer
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
        />
        <FeatureGroup>
          {markers &&
            markers.map((m, idx) => (
              <MapMarker key={idx} data={m} onClick={setPopup} />
            ))}
          <Popup>
            {popup && (
              <Box p="4">
                {popup.stopName}
                <Box textAlign="right">
                  <NextLink passHref href={`stops/${popup.id}`}>
                    <Link
                      sx={{
                        '&&': {
                          color: 'blue.500',
                          fontSize: 'md',
                          fontWeight: 'medium',
                        },
                      }}
                    >
                      View Report
                    </Link>
                  </NextLink>
                </Box>
              </Box>
            )}
          </Popup>
        </FeatureGroup>
      </MapContainer>
    </Box>
  )
}

const MapMarker = ({ onClick, data }) => {
  const map = useMap()
  const handleClick = (latlng) => {
    map.flyTo(latlng, map.getZoom())
    onClick(data)
  }

  const markerColor =
    data.Watchers?.scores?.overall >= 90
      ? 'green'
      : data.Watchers?.scores?.overall < 90 &&
        data.Watchers?.scores?.overall >= 50
      ? 'yellow'
      : 'red'

  const color = useToken('colors', `${markerColor}.500`)

  return (
    <CircleMarker
      eventHandlers={{
        click: (e) => handleClick(e.latlng),
      }}
      center={{ lat: data.stopLat, lng: data.stopLon }}
      radius={4}
      pathOptions={{
        color,
        fillOpacity: 1,
        // opacity: 0.3,
        // weight: 10,
      }}
    />
  )
}
