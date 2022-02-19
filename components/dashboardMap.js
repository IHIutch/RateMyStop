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
import mean from 'lodash/mean'

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
        // center={[42.886, -78.879]}
        center={[42.9071, -78.7777]}
        zoom={11}
        preferCanvas={true}
        zoomControl={false}
      >
        <ZoomControl position="topright" />
        <TileLayer
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
        />
        <FeatureGroup>
          {markers?.map((m, idx) => (
            <MapMarker key={idx} data={m} onClick={setPopup} />
          ))}
          <Popup>
            {popup && (
              <Box p="4">
                {popup.stopName}
                {popup.id}
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
    // map.flyTo(latlng, map.getZoom())
    onClick(data)
  }

  const overall =
    data?.watchers?.scores &&
    !Object.values(data.watchers.scores).includes('-1')
      ? mean(Object.values(data.watchers.scores))
      : '-1'

  const markerColor =
    overall >= 90
      ? 'green.500'
      : overall >= 50
      ? 'yellow.500'
      : overall >= 0
      ? 'red.500'
      : 'black'

  const color = useToken('colors', markerColor)

  return (
    <CircleMarker
      eventHandlers={{
        click: (e) => handleClick(e.latlng),
      }}
      center={{ lat: data.stopLat, lng: data.stopLon }}
      radius={markerColor === 'black' ? 2 : 5}
      pathOptions={{
        color,
        fillOpacity: 1,
        // opacity: 0.3,
        weight: 0,
      }}
    />
  )
}
