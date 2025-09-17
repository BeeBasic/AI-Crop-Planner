package com.example.krishimitrr

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import com.example.krishimitrr.ui.theme.GreenLine1
import com.example.krishimitrr.ui.theme.GreenLine2
import com.example.krishimitrr.ui.theme.GreenLine3
import com.example.krishimitrr.ui.theme.GreenLine4
import com.example.krishimitrr.ui.theme.GreenLine5
import kotlinx.coroutines.delay
import kotlin.math.cos
import kotlin.math.min
import kotlin.math.pow
import kotlin.math.sin
import kotlin.math.sqrt
import kotlin.random.Random

// --- Color Scheme ---
private val bgColor = Color(0xFFFFFBEF) // Soft Cream

// List of green colors for lines and nodes
private val lineAndNodeColors = listOf(
    GreenLine1,
    GreenLine2,
    GreenLine3,
    GreenLine4,
    GreenLine5
)

// --- Data Structures ---
private data class GrowthNode(
    val id: Int,
    val initialPos: Offset,
    var currentPos: Offset = initialPos,
    var spawnTime: Long,
    var alpha: Float = 0f,
    var radius: Float = 0f,
    val targetRadius: Float,
    var connectionsMade: Int = 0,
    val maxConnections: Int = 2,
    val lifeTime: Long,
    var isFadingOut: Boolean = false,
    val color: Color // Added color property for the node
)

private data class GrowthEdge(
    val fromNodeId: Int,
    val toNodeId: Int,
    val spawnTime: Long,
    var progress: Float = 0f,
    var visualAlpha: Float = 0f,
    val thickness: Float,
    var fullyFormedTime: Long? = null,
    val lifeTimeAfterFormation: Long = 500L,
    val color: Color // Added color property for the edge
)

@Composable
fun GrowingPolygonsBackground() {
    val nodes = remember { mutableStateListOf<GrowthNode>() }
    val edges = remember { mutableStateListOf<GrowthEdge>() }
    val random = remember { Random(System.currentTimeMillis()) }
    var nextNodeId by remember { mutableStateOf(0) }
    val density = LocalDensity.current.density

    val maxNodesOnScreen = 38
    val nodeTargetRadiusMin = (1.5.dp.value * density)
    val nodeTargetRadiusMax = (3.dp.value * density)
    val edgeThicknessMin = (0.5.dp.value * density)
    val edgeThicknessMax = (1.dp.value * density)

    val nodeInitialFadeInDuration = 1500L
    val nodeFadeOutDuration = 1500L
    val edgeDrawDuration = 1000L
    val edgeFadeOutDuration = 500L

    val animationTime by rememberInfiniteTransition(label = "gp_anim_loop").animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 16, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "gp_anim_trigger"
    )

    LaunchedEffect(Unit) {
        for (i in 0 until 6) {
            if (nodes.size < maxNodesOnScreen) {
                nodes.add(
                    GrowthNode(
                        id = nextNodeId++,
                        initialPos = Offset(random.nextFloat(), random.nextFloat()),
                        spawnTime = System.currentTimeMillis(),
                        targetRadius = random.nextFloat() * (nodeTargetRadiusMax - nodeTargetRadiusMin) + nodeTargetRadiusMin,
                        lifeTime = random.nextLong(6000L, 12000L),
                        color = lineAndNodeColors.random(random) // Assign random green color
                    )
                )
                delay(120)
            }
        }

        while (true) {
            val currentTime = System.currentTimeMillis()

            if (nodes.size < maxNodesOnScreen && random.nextFloat() < 0.15) {
                val spawnRandomly = random.nextFloat() < 0.4
                val parentNode = if (!spawnRandomly && nodes.isNotEmpty()) nodes.filter { !it.isFadingOut && it.alpha > 0.5f }.randomOrNull(random) else null

                val newPos = if (parentNode != null) {
                    val angle = random.nextFloat() * 2 * Math.PI.toFloat()
                    val spawnDistance = random.nextFloat() * 0.25f + 0.1f
                    Offset(
                        (parentNode.currentPos.x + cos(angle) * spawnDistance).coerceIn(0.0f, 1.0f),
                        (parentNode.currentPos.y + sin(angle) * spawnDistance).coerceIn(0.0f, 1.0f)
                    )
                } else {
                    Offset(random.nextFloat(), random.nextFloat())
                }

                nodes.add(
                    GrowthNode(
                        id = nextNodeId++,
                        initialPos = newPos,
                        spawnTime = currentTime,
                        targetRadius = random.nextFloat() * (nodeTargetRadiusMax - nodeTargetRadiusMin) + nodeTargetRadiusMin,
                        lifeTime = random.nextLong(6000L, 12000L),
                        color = lineAndNodeColors.random(random) // Assign random green color
                    )
                )
            }

            nodes.filter { !it.isFadingOut && it.alpha > 0.6f && it.connectionsMade < it.maxConnections }.forEach { node ->
                if (random.nextFloat() < 0.50) {
                    val potentialPartners = nodes.filter {
                        it.id != node.id && !it.isFadingOut && it.alpha > 0.6f && it.connectionsMade < it.maxConnections &&
                                !edges.any { edge ->
                                    (edge.fromNodeId == node.id && edge.toNodeId == it.id) ||
                                    (edge.fromNodeId == it.id && edge.toNodeId == node.id)
                                }
                    }.sortedBy { partner -> distance(node.currentPos, partner.currentPos) }
                        .take(2)

                    potentialPartners.firstOrNull()?.let { partnerNode ->
                        if (node.connectionsMade < node.maxConnections && partnerNode.connectionsMade < partnerNode.maxConnections) {
                            edges.add(
                                GrowthEdge(
                                    fromNodeId = node.id,
                                    toNodeId = partnerNode.id,
                                    spawnTime = currentTime,
                                    thickness = random.nextFloat() * (edgeThicknessMax - edgeThicknessMin) + edgeThicknessMin,
                                    color = lineAndNodeColors.random(random) // Assign random green color to edge
                                )
                            )
                            node.connectionsMade++
                            partnerNode.connectionsMade++
                        }
                    }
                }
            }

            val nodesToRemove = mutableListOf<GrowthNode>()
            nodes.forEach { node ->
                val timeSinceOriginalSpawn = currentTime - node.spawnTime
                val currentAlphaTime = if(node.isFadingOut) currentTime - node.spawnTime else timeSinceOriginalSpawn

                if (node.isFadingOut) {
                    val fadeProgress = currentAlphaTime.toFloat() / nodeFadeOutDuration
                    node.alpha = (1f - fadeProgress).coerceIn(0f, 1f)
                    if (node.alpha == 0f) nodesToRemove.add(node)
                } else {
                    node.alpha = (currentAlphaTime.toFloat() / nodeInitialFadeInDuration).coerceAtMost(1.0f)
                    if (timeSinceOriginalSpawn > node.lifeTime) {
                        node.isFadingOut = true
                        node.spawnTime = currentTime
                    }
                }
                node.radius = node.targetRadius * node.alpha
            }
            nodes.removeAll(nodesToRemove)

            val edgesToRemove = mutableListOf<GrowthEdge>()
            edges.forEach { edge ->
                val fromNodeExists = nodes.any { it.id == edge.fromNodeId && !it.isFadingOut && it.alpha > 0.05f}
                val toNodeExists = nodes.any { it.id == edge.toNodeId && !it.isFadingOut && it.alpha > 0.05f }

                if (!fromNodeExists || !toNodeExists) {
                     edge.visualAlpha = (edge.visualAlpha - 0.05f).coerceAtLeast(0f)
                     if (edge.visualAlpha == 0f) edgesToRemove.add(edge)
                     return@forEach
                }

                val timeSinceEdgeSpawn = currentTime - edge.spawnTime
                if (edge.fullyFormedTime == null) {
                    edge.progress = (timeSinceEdgeSpawn.toFloat() / edgeDrawDuration).coerceAtMost(1.0f)
                    edge.visualAlpha = edge.progress
                    if (edge.progress == 1.0f) {
                        edge.fullyFormedTime = currentTime
                    }
                } else {
                    val timeSinceFormed = currentTime - edge.fullyFormedTime!!
                    if (timeSinceFormed > edge.lifeTimeAfterFormation) {
                        val fadeProgress = (timeSinceFormed - edge.lifeTimeAfterFormation).toFloat() / edgeFadeOutDuration
                        edge.visualAlpha = (1f - fadeProgress).coerceIn(0f, 1f)
                        if (edge.visualAlpha == 0f) edgesToRemove.add(edge)
                    } else {
                        edge.visualAlpha = 1.0f
                    }
                }
            }
            edges.removeAll(edgesToRemove)

            delay(16)
        }
    }

    Box(modifier = Modifier.fillMaxSize().background(bgColor)) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            if(animationTime >= 0f || animationTime <= 2f ) { // This condition always true, consider removing
                edges.forEach { edge ->
                    val fromNode = nodes.find { it.id == edge.fromNodeId }
                    val toNode = nodes.find { it.id == edge.toNodeId }
                    if (fromNode != null && toNode != null && edge.visualAlpha > 0.01f) {
                        val effectiveEdgeAlpha = min(edge.visualAlpha, min(fromNode.alpha, toNode.alpha))
                        if (effectiveEdgeAlpha <= 0.01f) return@forEach

                        val startX = fromNode.currentPos.x * size.width
                        val startY = fromNode.currentPos.y * size.height
                        val endX = toNode.currentPos.x * size.width
                        val endY = toNode.currentPos.y * size.height

                        val currentEndX = startX + (endX - startX) * edge.progress
                        val currentEndY = startY + (endY - startY) * edge.progress

                        drawLine(
                            color = edge.color.copy(alpha = effectiveEdgeAlpha), // Use edge's assigned color
                            start = Offset(startX, startY),
                            end = Offset(currentEndX, currentEndY),
                            strokeWidth = edge.thickness * effectiveEdgeAlpha,
                            cap = StrokeCap.Round
                        )
                    }
                }
                nodes.forEach { node ->
                    if (node.alpha > 0.01f && node.radius > 0.1f) {
                        drawCircle(
                            color = node.color.copy(alpha = node.alpha), // Use node's assigned color
                            radius = node.radius,
                            center = Offset(node.currentPos.x * size.width, node.currentPos.y * size.height)
                        )
                    }
                }
            }
        }
    }
}

private fun distance(p1: Offset, p2: Offset): Float {
    return sqrt((p1.x - p2.x).pow(2) + (p1.y - p2.y).pow(2))
}
